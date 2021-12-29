import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Avatar, Typography, Link } from "@mui/material";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function PositionHistory({
  productionId,
  positionId,
  setUserId,
}) {
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
      renderCell: (params) => (
        <Link
          color="inherit"
          underline="none"
          onClick={() => {
            handleProfile(params.value);
          }}
        >
          {params.value}
        </Link>
      ),
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

  const handleProfile = async (name) => {
    const userRef = query(
      collection(db, "user"),
      where("displayname", "==", name)
    );

    const user = await getDocs(userRef);
    let userId = "";
    user.forEach((doc) => {
      userId = doc.id;
    });
    setUserId(userId);
    navigate("/user-profile");
  };

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

        let arr2 = [];
        const querySnapshot2 = await getDocs(userRef);
        querySnapshot2.forEach((doc) => {
          if (arrUser.includes(doc.id)) {
            arr2.push({ docid: doc.id, data: doc.data() });
          }
        });

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
