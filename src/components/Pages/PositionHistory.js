import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Avatar, Typography } from "@mui/material";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const columns = [
  {
    field: "avatar",
    headerName: "Avatar",
    width: 80,
    renderCell: (params) => <Avatar src={params.value} alt="ProfilePic" />,
  },
  {
    field: "displayName",
    headerName: "Display Name",
    width: 130,
  },
  {
    field: "status",
    headerName: "Status",
    width: 75,
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

export default function PositionHistory({ productionId, positionId }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    avatar: "",
    displayName: "",
    status: "",
    date: new Date(),
    details: "",
  });
  const [positionData, setPositionData] = useState({});
  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);
      try {
        const positionRef = doc(
          db,
          "production",
          productionId,
          "position",
          positionId
        );

        await getDoc(positionRef).then((res) => {
          setPositionData(res.data());
        });

        const posHisRef = collection(
          db,
          "production",
          productionId,
          "position",
          positionId,
          "positionhistory"
        );
        const userRef = collection(db, "user");

        const querySnapshot = await getDocs(posHisRef);
        let arr = [];
        let arrUser = [];
        querySnapshot.forEach((doc) => {
          arr.push(doc.data());
          if (doc.data().userid !== "") {
            arrUser.push(doc.data().userid);
          }
        });
        console.log(arr);
        let arr2 = [];
        const querySnapshot2 = await getDocs(userRef);
        querySnapshot2.forEach((doc) => {
          if (arrUser.includes(doc.id)) {
            arr2.push({ docid: doc.id, data: doc.data() });
          }
        });
        console.log(arr2);
        let arr3 = [];
        //sort and set data
        let i = 0;
        arr.forEach((doc) => {
          if (arrUser.includes(doc.userid)) {
            let user = arr2.find(({ docid }) => docid === doc.userid);
            arr3.push({
              id: i + 1,
              avatar: user.data.avatarurl,
              displayName: user.data.displayname,
              status: doc.status,
              date:
                doc.date.toDate().toLocaleString("en-US", { timeZone: "UTC" }) +
                " UTC+8",
              details: doc.positiondetails,
            });
          } else {
            arr3.push({
              id: i + 1,
              avatar: null,
              displayName: null,
              status: doc.status,
              date:
                doc.date.toDate().toLocaleString("en-US", { timeZone: "UTC" }) +
                " UTC+8",
              details: doc.positiondetails,
            });
          }
          i++;
        });

        setData(arr3);
        console.log(arr3);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        navigate("/production-crew-list");
      }
    };
    getHistory();
  }, [navigate, positionId, productionId]);
  return (
    <div style={{ height: 400, width: "100%" }}>
      {!loading ? (
        <div style={{ height: 400, width: "100%" }}>
          <Typography variant="h4" textAlign="center">
            {positionData.name} History
          </Typography>
          <DataGrid rows={data} columns={columns} disableSelectionOnClick />
        </div>
      ) : (
        "loading..."
      )}
    </div>
  );
}
