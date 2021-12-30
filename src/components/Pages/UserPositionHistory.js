import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import {
  getDocs,
  getDoc,
  query,
  where,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function UserPositionHistory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    productionName: "",
    departmentName: "",
    positionName: "",
    status: "",
    date: new Date(),
    details: "",
  });
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const columns = [
    {
      field: "productionName",
      headerName: "Production",
      width: 130,
    },
    {
      field: "departmentName",
      headerName: "Department",
      width: 170,
    },
    {
      field: "positionName",
      headerName: "PositionName",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "date",
      headerName: "Date",
      type: "dateTime",
      width: 230,
    },
    {
      field: "details",
      headerName: "Details",
      minWidth: 600,
      flex: 1,
    },
  ];

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);
      try {
        const userHisRef = query(
          collectionGroup(db, "positionhistory"),
          where("userid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(userHisRef);

        const parentsPromises = [];
        const grandparentsPromises = [];
        let arr = [];

        querySnapshot.forEach((doc) => {
          const docRef = doc.ref;

          const parentCollectionRef = docRef.parent; //collection Reference

          const immediateParentDocumentRef = parentCollectionRef.parent; //Document Reference

          const grandParentDocumentRef =
            immediateParentDocumentRef.parent.parent; // DocumentReference

          parentsPromises.push(getDoc(immediateParentDocumentRef));
          grandparentsPromises.push(getDoc(grandParentDocumentRef));
          arr.push(doc.data());
        });

        const arrayOfParentsDocumentSnapshots = await Promise.all(
          parentsPromises
        );
        const arrayOfGrandparentsDocumentSnapshots = await Promise.all(
          grandparentsPromises
        );

        let arr2 = [];

        let i = 0;
        arr.forEach((doc) => {
          arr2.push({
            id: i,
            productionName: arrayOfGrandparentsDocumentSnapshots[i].data().name,
            departmentName:
              arrayOfParentsDocumentSnapshots[i].data().departmentname,
            positionName: arrayOfParentsDocumentSnapshots[i].data().name,
            status: doc.status,
            date: doc.date.toDate().toLocaleString("en-US") + " UTC+8",
            details: doc.positiondetails,
          });
          i++;
        });
        setData(arr2);

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        navigate("/position-offer");
      }
    };
    getHistory();
  }, [currentUser.uid, navigate]);

  return (
    <div style={{ height: 400, width: "100%" }}>
      {!loading ? (
        <div style={{ height: 400, width: "100%" }}>
          <Typography variant="h4" textAlign="center">
            History
          </Typography>
          <DataGrid rows={data} columns={columns} disableSelectionOnClick />
        </div>
      ) : (
        "loading..."
      )}
    </div>
  );
}
