import React from "react";
import { useState, useEffect } from "react";
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

export default function ProductionList() {
  //current user that is logged in
  const { currentUser } = useAuth();
  const userUid = currentUser.uid;
  const navigate = useNavigate();
  //Data for production Company

  const [data3, setData3] = useState({
    id: "root",
    name: "Production Company Owned",
    children: [{ id: "1", name: "Company Name", docId: "" }],
  });
  const [loading, setLoading] = useState(true);

  //When page load setLoading to true
  //Get Production Company owned & production Owned
  useEffect(() => {
    const getProductionCompany = async () => {
      setLoading(true);
      //get Document reference from firebase by using current user uid
      //if the owners field contains user uid

      const q2 = query(
        collection(db, "production"),
        where("owners", "array-contains", userUid)
      );
      //Get company specified docs
      const querySnapshot2 = await getDocs(q2);

      //this variables are for productions object
      let arr2 = [];
      let n = 0;
      //For each company the user owned will add to children property of Data
      //also adds a Id with each children incrementing
      //gets the production id
      let arr4 = [];
      querySnapshot2.forEach((doc) => {
        arr2.push({
          id: (n + 1).toString(),
          name: doc.data().name,
          proId: doc.id,
        });
        arr4.push(doc.id);
        n++;
      });

      //sets the Data for all the array elements in arry
      setData3({
        id: "root2",
        name: "Production Owned",
        children: arr2,
      });
      //When all is done set loading to false
      setLoading(false);
    };

    getProductionCompany();
  }, [userUid]);

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

  return (
    <div>
      {!loading ? (
        <>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultExpanded={["root2"]}
            sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
          >
            {renderTree(data3)}
          </TreeView>
        </>
      ) : (
        "loading..."
      )}
    </div>
  );
}
