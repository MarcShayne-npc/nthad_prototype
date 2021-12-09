import React from "react";
import { useState, useRef, useEffect } from "react";
import { Grid, TextField } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Button from "@mui/material/Button";
import { db } from "../../firebase";
import {
  query,
  where,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";

export default function CreateDepartment({ productionId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  //current user that is logged in
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  //All the references for the fields in Production
  const nameRef = useRef();
  const autoRef = useRef();
  const aboutRef = useRef();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "",
  });
  //   useEffect(() => {
  //     const getUsers = async () => {
  //       setLoading(true);

  //       try {
  //         const docRef = doc(db, "productioncompany", companyId);
  //         await getDoc(docRef).then((res) => {
  //           setCompanyData({
  //             name: res.data().name,
  //           });
  //         });
  //       } catch {
  //         navigate("/producer-page");
  //       }
  //       setLoading(false);
  //     };
  //     getUsers();
  //   }, [companyId, navigate]);

  //When user press submit button
  const handleEditUser = async () => {
    //Gets all the reference and add document to firestore
    try {
      //validation if name & short name has value
      if (autoRef.current.value !== "") {
        setError(false);
        const departmentRef = collection(
          db,
          "production",
          productionId,
          "department"
        );

        await setDoc(departmentRef, {
          department_fields: {
            parentid: "",
            haschildren: false,
            name: autoRef.current.value,
          },
        });
        //set the Alert to Success and display message
        setStatusBase({
          lvl: "success",
          msg: "Production Company Created",
          key: Math.random(),
        });
        // navigate("/producer-page");
      } else {
        //if user required fields are empty
        setError(true);
        setStatusBase({
          lvl: "error",
          msg: "Required fields are empty",
          key: Math.random(),
        });
      }
    } catch (err) {
      console.log(err);
      //something went wrong
      setStatusBase({
        lvl: "error",
        msg: "Failed to Create Department.",
        key: Math.random(),
      });
    }
  };

  const handleBack = () => {
    navigate("/production-crew-list");
  };

  const handleAuto = (e) => {
    let x = e.target.value;
    console.log(x.length);
    if (x.length <= 15) {
      autoRef.current.value = e.target.value;
    }
  };

  return (
    <form>
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
          {!loading ? (
            <Grid item xs={11} sm={8} md={6}>
              <h2>Create Department for {companyData.name}</h2>
            </Grid>
          ) : (
            "loading..."
          )}
        </Grid>
        {/*==================Name Section==================*/}
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
            <TextField
              id="outlined-required"
              type="text"
              variant="outlined"
              inputRef={nameRef}
              error={error}
              required
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={11} sm={8} md={3}>
            Name of Department:
            <TextField
              inputProps={{ maxLength: 15 }}
              id="outlined-required"
              type="text"
              variant="outlined"
              inputRef={autoRef}
              error={error}
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
            <Button onClick={handleEditUser} variant="outlined">
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
    </form>
  );
}
