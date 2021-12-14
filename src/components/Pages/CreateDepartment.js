import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import {
  query,
  where,
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../../contexts/AuthContext";

export default function CreateDepartment({ productionId, companyId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //current user that is logged in
  const navigate = useNavigate();
  const nameRef = useRef();
  const postRef = useRef();
  const [error, setError] = useState({ name: false, parent: false });
  const [loading, setLoading] = useState(false);
  const [productionData, setProductionData] = useState({
    name: "",
  });
  const { currentUser } = useAuth();
  const [department, setDepartment] = useState([]);
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  //value in the auto-complete textfield
  const [value, setValue] = useState(null);

  //This is for the autocomplete section in the department
  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //get all non-sub-department for auto list later
        const docRef = query(
          collection(db, "production", productionId, "department"),
          where("parentid", "==", "")
        );
        const querySnapshot = await getDocs(docRef);
        let arr2 = [];
        //get company name
        const coRef = doc(db, "productioncompany", companyId);
        await getDoc(coRef).then((res) => {
          setCompanyData({
            name: res.data().name,
          });
        });

        querySnapshot.forEach((doc) => {
          arr2.push({ name: doc.data().name, id: doc.id });
        });
        setDepartment(arr2);
      } catch (err) {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [companyId, navigate, productionId]);

  //get Production name
  useEffect(() => {
    const getProduction = async () => {
      setLoading(true);
      try {
        //get production name
        const docRef = doc(db, "production", productionId);
        await getDoc(docRef).then((res) => {
          setProductionData({
            name: res.data().name,
          });
        });
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getProduction();
  }, [navigate, productionId]);

  //When user press submit button
  const handleCreateDepartment = async () => {
    //Gets all the reference and add document to firestore
    try {
      let parentId = "";
      if (value !== null) {
        //Finds the department Id & name
        parentId = department.find((obj) => {
          return obj.name === value.name;
        });
      }

      //validation if name has value
      if (
        nameRef.current.value !== "" &&
        nameRef.current.value.trim() !== "" &&
        postRef.current.value !== "" &&
        postRef.current.value.trim() !== ""
      ) {
        setError({ name: false, parent: false });

        //auto complete when its blank
        //else if false then update department
        if (parentId.id === undefined) {
          parentId = { id: "" };
        } else {
          const docRef = doc(
            db,
            "production",
            productionId,
            "department",
            parentId.id
          );
          await updateDoc(docRef, {
            haschildren: true,
          });
        }
        //adds document in production/department
        const deparmentId = await addDoc(
          collection(db, "production", productionId, "department"),
          {
            parentid: parentId.id,
            haschildren: false,
            name: nameRef.current.value,
          }
        );
        //adds document in production/position
        const positionId = await addDoc(
          collection(db, "production", productionId, "position"),
          {
            name: postRef.current.value,
            departmentid: deparmentId.id,
            departmentname: nameRef.current.value,
            isdepartmenthead: true,
            supervisorid: "",
            status: "active", //from defined list "crewstatus"
            userid: currentUser.uid, //userid
            date: serverTimestamp(),
            //then since positionRef.id is now declared
            //add to reference then add document
          }
        );
        //add document in production/postion/positionhistory
        await addDoc(
          collection(
            db,
            "production",
            productionId,
            "position",
            positionId.id,
            "positionhistory"
          ),
          {
            status: "created",
            date: serverTimestamp(),
            updatedbyid: currentUser.uid,
            positiondetails: "",
            userid: "",
          }
        );

        //add document in user/userposition
        await addDoc(collection(db, "user", currentUser.uid, "userposition"), {
          productioncompanyid: companyId,
          productioncompanyname: companyData.name,
          productionid: productionId,
          positionid: positionId.id,
          productionname: productionData.name,
          departmentname: nameRef.current.value,
          departmentid: deparmentId.id,
          positionname: postRef.current.value,
          positiondetails: "",
          date: serverTimestamp(),
        });
        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Production Company Created",
          key: Math.random(),
        });
        setTimeout(() => {
          //set the Alert to Success and display message
          navigate("/production-crew-list");
        }, 1000);
      } else {
        //if user required fields are empty
        setError({ name: true });
        setStatusBase({
          lvl: "error",
          msg: "Required fields are empty",
          key: Math.random(),
        });
      }
    } catch (err) {
      console.log(err);
      setError({ parent: true });
      //something went wrong
      setStatusBase({
        lvl: "error",
        msg: "Failed to Create Department. Make sure that Parent Department exist",
        key: Math.random(),
      });
    }
  };

  const handleBack = () => {
    navigate("/production-crew-list");
  };

  return (
    <form>
      {!loading ? (
        <Grid>
          <Button onClick={handleBack}>Back</Button>
          {/*==================Create Deparment Section==================*/}
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={6}>
              <h2>Create Department for {productionData.name}</h2>
            </Grid>
          </Grid>
          {/*==================Department & name Section==================*/}
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={3}>
              Parent Department(Optional):
              <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    setValue({
                      name: newValue,
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setValue({
                      name: newValue.inputValue,
                    });
                  } else {
                    setValue(newValue);
                  }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={department}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }

                  // Regular option
                  return option.name;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                renderInput={(params) => (
                  <TextField error={error.parent} {...params} />
                )}
              />
            </Grid>
            <Grid item xs={11} sm={8} md={3}>
              Name of Department:
              <TextField
                id="outlined-required"
                type="text"
                variant="outlined"
                inputRef={nameRef}
                error={error.name}
                required
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            columnSpacing={1}
            rowSpacing={1}
            direction="row"
            justifyContent="center"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={11} sm={8} md={3}>
              Position Name:
              <TextField
                id="outlined-required"
                type="text"
                variant="outlined"
                inputRef={postRef}
                error={error.name}
                required
                sx={{ width: "100%" }}
              />
            </Grid>
          </Grid>
          {/*==================Alert & Button Section==================*/}
          <Grid
            container
            columnSpacing={5}
            rowSpacing={5}
            direction="row"
            justifyContent="right"
            alignItems="center"
            marginBottom={1}
          >
            <Grid item xs={4}>
              <Button onClick={handleCreateDepartment} variant="outlined">
                Create
              </Button>
              {status ? (
                <AlertMessage
                  level={status.lvl}
                  key={status.key}
                  message={status.msg}
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      ) : (
        "loading..."
      )}
    </form>
  );
}
