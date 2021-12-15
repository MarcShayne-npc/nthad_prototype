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
  writeBatch,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../../contexts/AuthContext";

export default function CreatePosition({
  productionId,
  companyId,
  departmentId,
}) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  const navigate = useNavigate();
  const nameRef = useRef();
  const [error, setError] = useState({ name: false, parent: false });
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth();
  const [supervisor, setSupervisor] = useState([]);
  const [departmentData, setDepartmentData] = useState({
    name: "",
  });
  //value in the auto-complete textfield
  const [value, setValue] = useState(null);

  //This is for the autocomplete section in the Position
  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //get supervisor
        const docRef = query(
          collection(db, "production", productionId, "position"),
          where("isdepartmenthead", "==", true),
          where("departmentid", "==", departmentId)
        );
        const querySnapshot = await getDocs(docRef);
        let arr2 = [];
        querySnapshot.forEach((doc) => {
          arr2.push({ name: doc.data().name, id: doc.id });
        });
        setSupervisor(arr2);

        //get Department name
        const depRef = doc(
          db,
          "production",
          productionId,
          "department",
          departmentId
        );
        await getDoc(depRef).then((res) => {
          setDepartmentData({
            name: res.data().name,
          });
        });
      } catch (err) {
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [companyId, departmentId, navigate, productionId]);

  //When user press submit button
  const handleCreatePosition = async () => {
    try {
      //check if position name textfield is empty
      if (nameRef.current.value !== "" && nameRef.current.value.trim() !== "") {
        setError({ name: false, parent: false });
        const positionHeadId = supervisor[0].id;
        let head = false;
        let supervisorId = "";

        //if blank meaning position the new positon is head
        if (value === null) {
          head = true;
        } else {
          //If there is an input meaning this new position is working for the head
          supervisorId = positionHeadId;
        }

        //adds new position document in production/position
        const positionId = await addDoc(
          collection(db, "production", productionId, "position"),
          {
            name: nameRef.current.value,
            departmentid: departmentId,
            departmentname: departmentData.name,
            isdepartmenthead: head,
            supervisorid: supervisorId,
            status: "created",
            userid: "", //userid
            date: serverTimestamp(),
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

        //update all position supervisorid and old head isDepartmenthead
        if (value === null) {
          await updateDoc(
            doc(db, "production", productionId, "position", positionHeadId),
            { isdepartmenthead: false }
          );

          const batch = writeBatch(db);
          const docRef = query(
            collection(db, "production", productionId, "position"),
            where("departmentid", "==", departmentId)
          );
          const querySnapshot = await getDocs(docRef);
          //update all position in the same department
          querySnapshot.forEach((res) => {
            const docRef = doc(
              db,
              "production",
              productionId,
              "position",
              res.id
            );
            //checks if its not document id is the same as the newly created position id
            if (res.id !== positionId.id) {
              batch.update(docRef, { supervisorid: positionId.id });
            }
          });
          await batch.commit();
        }

        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Position Created",
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
        msg: "Failed to Create Position.",
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
          {/*==================Position Create Section==================*/}
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
              <h2>Create Position for {departmentData.name}</h2>
            </Grid>
          </Grid>
          {/*==================Postion & name Section==================*/}
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
              Supervisor:
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
                options={supervisor}
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
              Name of Position:
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
              <Button onClick={handleCreatePosition} variant="outlined">
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
