import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import {
  query,
  where,
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../../contexts/AuthContext";

export default function EditDepartment({ departmentId, productionId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");

  const navigate = useNavigate();
  const nameRef = useRef();
  const [error, setError] = useState({ name: false, parent: false });
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState({
    name: "",
  });
  const { currentUser } = useAuth();
  const [department, setDepartment] = useState([]);
  const [userPosDep, setUserPosDep] = useState([]);
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
        //get all document id from user/userposition
        //to change department name later
        const depRef = query(
          collection(db, "user", currentUser.uid, "userposition"),
          where("departmentid", "==", departmentId)
        );
        let arr = [];
        let depName = "";
        const department = await getDocs(depRef);
        department.forEach((doc) => {
          arr.push(doc.id);
          depName = doc.data().departmentname;
        });
        console.log(depName);
        setUserPosDep(arr);

        const querySnapshot = await getDocs(docRef);
        let arr2 = [];

        querySnapshot.forEach((doc) => {
          //removes its own name cause a parent dep can't be its own parent dep
          if (doc.data().name !== depName) {
            arr2.push({ name: doc.data().name, id: doc.id });
          }
        });
        setDepartment(arr2);
      } catch (err) {
        console.log(err);
        //navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [currentUser.uid, departmentId, navigate, productionId]);

  //get Department name
  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //get production name
        const docRef = doc(
          db,
          "production",
          productionId,
          "department",
          departmentId
        );
        await getDoc(docRef).then((res) => {
          setDepartmentData({
            name: res.data().name,
          });
        });
      } catch {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [departmentId, navigate, productionId]);

  //When user press submit button
  const handleEditDepartment = async () => {
    try {
      //validation if name has value
      if (nameRef.current.value !== "" && nameRef.current.value.trim() !== "") {
        setError({ name: false, parent: false });

        //when department want to join a department as a sub department

        //update departmentname department

        //update departmentname position

        //update departmentname at userposition
        const batch = writeBatch(db);
        userPosDep.foreach((id) => {
          const updateName = doc(
            db,
            "user",
            currentUser.uid,
            "userposition",
            id
          );
          batch.update(updateName, { departmentname: nameRef.current.value });
        });
        await batch.commit();

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
          {/*==================Department edit Section==================*/}
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
              <h2>Edit Department | {departmentData.name}</h2>
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
              Change Department:
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
                defaultValue={departmentData.name}
                inputRef={nameRef}
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
              <Button onClick={handleEditDepartment} variant="outlined">
                Update
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
