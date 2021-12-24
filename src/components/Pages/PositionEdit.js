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
  updateDoc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import AlertMessage from "../Tools&Hooks/AlertMessage";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../../contexts/AuthContext";

export default function PositionEdit({ productionId, companyId, positionId }) {
  //Set AlertMessage Status and passes to Alertmessage hook
  const [status, setStatusBase] = useState("");
  const navigate = useNavigate();
  const nameRef = useRef();
  const [error, setError] = useState({ name: false, parent: false });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [supervisor, setSupervisor] = useState([]);
  const [positionData, setPositionData] = useState({
    name: "",
  });
  const [allPos, setAllPos] = useState([]);
  //value in the auto-complete textfield
  const [value, setValue] = useState(null);
  const [isHead, setIsHead] = useState(false);
  console.log(productionId);
  console.log(companyId);
  console.log(positionId);
  useEffect(() => {
    const getDepartment = async () => {
      setLoading(true);
      try {
        //get Department name
        const docRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );
        let supId = "";
        let depId = "";
        await getDoc(docRef).then((res) => {
          console.log(res.data());
          setPositionData({
            name: res.data().name,
          });
          supId = res.data().supervisorid;
          depId = res.data().departmentid;
          setIsHead(res.data().isdepartmenthead);
        });

        //get all position in that department used later
        //when edited position change into new supervisor
        const allPosRef = query(
          collection(db, "production", productionId, "position"),
          where("departmentid", "==", depId)
        );
        const querySnapshot = await getDocs(allPosRef);
        let arr2 = [];
        querySnapshot.forEach((doc) => {
          arr2.push(doc.id);
        });
        console.log("supId" + supId);
        setAllPos(arr2);
        if (supId !== "") {
          //get supervisor
          const posRef = doc(db, "production", productionId, "position", supId);
          let arr = [];
          await getDoc(posRef).then((doc) => {
            arr = [{ name: doc.data().name, id: doc.id }];
          });
          console.log(arr);
          setSupervisor(arr);
        }
      } catch (err) {
        console.log(err);
        navigate("/producer-page");
      }
      setLoading(false);
    };
    getDepartment();
  }, [companyId, currentUser.uid, navigate, positionId, productionId]);

  const handleEditPosition = async () => {
    if (nameRef.current.value !== "" && nameRef.current.value.trim() !== "") {
      setError({ name: false, parent: false });

      //update new name in production/position
      const docRef = doc(
        db,
        "production",
        productionId,
        "position",
        positionId
      );
      if (value === null && isHead !== true) {
        //update if its a supervisor
        //update last supervisor and change to non-head position
        await updateDoc(docRef, {
          name: nameRef.current.value,
          supervisorid: "",
          isdepartmenthead: true,
        });
        const supRef = doc(
          db,
          "production",
          productionId,
          "position",
          supervisor[0].id
        );
        await updateDoc(supRef, { supervisorid: "", isdepartmenthead: false });
        const batch = writeBatch(db);
        //update all position supervisor in that department
        allPos.forEach((id) => {
          let idRef = doc(db, "production", productionId, "position", id);
          if (positionId !== id) {
            batch.update(idRef, { supervisorid: positionId });
          }
        });
        await batch.commit();
      } else {
        await updateDoc(docRef, {
          name: nameRef.current.value,
        });
      }

      setStatusBase({
        lvl: "success",
        msg: "Position Edited",
        key: Math.random(),
      });
      setTimeout(() => {
        //set the Alert to Success and display message
        navigate("/production-crew-list");
      }, 1000);
    } else {
      setError({ name: true });
      setStatusBase({
        lvl: "error",
        msg: "Required fields are empty",
        key: Math.random(),
      });
    }
  };
  const handleBack = () => {
    navigate("/production-crew-list");
  };
  return (
    <div>
      <form>
        {!loading ? (
          <Grid>
            <Button onClick={handleBack}>Back</Button>
            {/*==================Position Edit Section==================*/}
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
                <h2>Edit Position: {positionData.name}</h2>
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
              {!isHead ? (
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
              ) : (
                <></>
              )}
              <Grid item xs={11} sm={8} md={3}>
                Name of Position:
                <TextField
                  defaultValue={positionData.name}
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
                <Button onClick={handleEditPosition} variant="outlined">
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
    </div>
  );
}
