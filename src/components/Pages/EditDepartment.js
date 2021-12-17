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
  updateDoc,
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
  const [proPos, setProPos] = useState([]);
  //value in the auto-complete textfield
  const [value, setValue] = useState(null);
  const [changeDep, setChangeDep] = useState(true);
  //This is for the autocomplete section in the department
  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //get all document id from user/userposition
        //to change department name later
        const depRef = query(
          collection(db, "user", currentUser.uid, "userposition"),
          where("departmentid", "==", departmentId)
        );
        let arr = [];
        const department = await getDocs(depRef);
        department.forEach((doc) => {
          arr.push(doc.id);
        });
        setUserPosDep(arr);

        //get all document id from production/position
        //to change department name later
        const proPosRef = query(
          collection(db, "production", productionId, "position"),
          where("departmentid", "==", departmentId)
        );
        let arr4 = [];
        const proPos = await getDocs(proPosRef);
        proPos.forEach((doc) => {
          arr4.push(doc.id);
        });
        setProPos(arr4);

        //get Department name
        const docRef = doc(
          db,
          "production",
          productionId,
          "department",
          departmentId
        );
        let departmentName = "";
        await getDoc(docRef).then((res) => {
          setDepartmentData({
            name: res.data().name,
            parentid: res.data().parentid,
          });
          departmentName = res.data().name;
        });

        //Autocomplete field only pesent option if department is a sub-department
        //Parent department are not allowed  removes autoComplete
        const allDepRef = collection(
          db,
          "production",
          productionId,
          "department"
        );
        const querySnapshot = await getDocs(allDepRef);
        let arr2 = [];
        let arr3 = [];
        //filter parent departments departments
        querySnapshot.forEach((doc) => {
          //get all Parent Departments
          if (doc.data().parentid === "") {
            arr2.push({ name: doc.data().name, id: doc.id });
            //if this is true meaning its a Parent department
            arr3.push(doc.data().name);
          }
        });

        if (arr3.includes(departmentName)) {
          setChangeDep(false);
        }
        setDepartment(arr2);
      } catch (err) {
        console.log(err);
        //navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [currentUser.uid, departmentId, navigate, productionId]);

  //When user press submit button
  const handleEditDepartment = async () => {
    try {
      //validation if name has value
      if (nameRef.current.value !== "" && nameRef.current.value.trim() !== "") {
        setError({ name: false, parent: false });
        //this happens only when change department field has value
        //if sub department want to change to a diffrent parent deparment or
        //Parent department with children are not allowed to become a sub department

        if (value !== null) {
          //change current parentid to new parent department
          const depRef = doc(
            db,
            "production",
            productionId,
            "department",
            departmentId
          );
          await updateDoc(depRef, { parentid: value.id });
          //Make new Parent department haschildren to true
          const newDepRef = doc(
            db,
            "production",
            productionId,
            "department",
            value.id
          );
          await updateDoc(newDepRef, { haschildren: true });
          //Update old department if it still has children
          const oldDepRef = query(
            collection(db, "production", productionId, "department"),
            where("parentid", "==", departmentData.parentid)
          );
          const querySnapshot = await getDocs(oldDepRef);
          if (querySnapshot.empty) {
            //if its empty then update department haschildren to false
            const docRef = doc(
              db,
              "production",
              productionId,
              "department",
              departmentData.parentid
            );
            await updateDoc(docRef, { haschildren: false });
          }
        }

        //update departmentname department
        const depRef = doc(
          db,
          "production",
          productionId,
          "department",
          departmentId
        );
        await updateDoc(depRef, { name: nameRef.current.value });
        //update departmentname position
        const batch = writeBatch(db);
        proPos.forEach((id) => {
          const updateNmae = doc(
            db,
            "production",
            productionId,
            "position",
            id
          );
          batch.update(updateNmae, { departmentname: nameRef.current.value });
        });

        //update departmentname at userposition
        userPosDep.forEach((id) => {
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
          msg: "Production Company Updated",
          key: Math.random(),
        });
        setTimeout(() => {
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
        msg: "Failed to Edit Department. Make sure that Parent Department exist",
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
            {changeDep ? (
              <Grid item xs={11} sm={8} md={3}>
                Change Department:
                <Autocomplete
                  value={value}
                  defaultValue={department[0]}
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
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            ) : (
              <></>
            )}
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
