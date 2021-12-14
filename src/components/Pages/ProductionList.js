import React from "react";
import { useState, useEffect, useRef } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import SvgIcon from "@mui/material/SvgIcon";

//Mui components for treeview https://mui.com/components/tree-view/
function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}
function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

export default function ProductionList({ setProductionId, setPositionId }) {
  //current user that is logged in
  const { currentUser } = useAuth();
  const userUid = currentUser.uid;
  const navigate = useNavigate();
  //Data for production Company

  const [data, setData] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [{ id: "1", name: "Company Name", docId: "" }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);

      const q = collection(db, "user", currentUser.uid, "userposition");
      const querySnapshot = await getDocs(q);

      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          id: doc.data().productionid,
          name: doc.data().productionname,
        });
      });

      //filters arr for duplicates
      const filteredArr = arr.reduce((acc, current) => {
        const x = acc.find((doc) => doc.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      //sets the Data for all the array elements in arry
      setData({
        id: "root",
        name: "Production",
        children: filteredArr,
      });

      //When all is done set loading to false
      setLoading(false);
    };

    getProductionCompany();
  }, [currentUser.uid, userUid]);

  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.id}
      nodeId={nodes.id}
      label={nodes.name}
      style={
        nodes.id.includes("root")
          ? { backgroundColor: "#5040a0", color: "white" }
          : { backgroundColor: "white", color: "black" }
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  const [positionData, setPositionData] = useState({
    id: "root",
    name: "Position",
    children: "",
  });

  const action = async (event, nodes) => {
    const q = query(
      collection(db, "production", nodes, "position"),
      where("userid", "==", currentUser.uid)
    );

    const querySnapshot = await getDocs(q);

    let arr = [];
    let arr2 = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        id: doc.id,
        name: doc.data().shortname,
      });
      arr2.push(doc.data().departmentname);
    });
    let arr3 = [];
    let i = 0;

    arr2.forEach((child) => {
      arr3.push({
        id: `parent ${i}`,
        name: child,
        children: [arr[i]],
      });

      i++;
    });

    if (!nodes.includes("root")) {
      setProductionId(nodes);
    }
    setPositionData({
      id: "root",
      name: "Position",
      children: arr3,
    });
  };

  const action2 = (event, nodes) => {
    if (!nodes.includes("parent") && !nodes.includes("root")) {
      setPositionId(nodes);
      navigate("/dashboard");
    }
  };

  const handlePosHis = () => {
    navigate("/position-history");
  };
  return (
    <div>
      {!loading ? (
        <>
          <Button onClick={handlePosHis}>Position History</Button>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultExpanded={["root"]}
            sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action}
          >
            {renderTree(data)}
          </TreeView>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultExpanded={["root"]}
            sx={{ height: 300, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action2}
          >
            {renderTree(positionData)}
          </TreeView>
        </>
      ) : (
        "loading..."
      )}
    </div>
  );
}
