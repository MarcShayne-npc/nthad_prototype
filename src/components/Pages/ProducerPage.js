import React from "react";
import { useState, useEffect } from "react";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

export default function ProducerPage({
  setProductionCompany,
  setProductionId,
}) {
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
  //for both production and company
  // const [data2, setData2] = useState({
  //   id: "root2",
  //   name: "Production Owned",
  //   children: [
  //     {
  //       id: "Parent 1",
  //       name: "Produtions Company",
  //       proCoId: "",
  //       children: [
  //         {
  //           id: "2",
  //           name: "Production",
  //           proId: "",
  //         },
  //       ],
  //     },
  //   ],
  // });
  //for prodution
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
      const q = query(
        collection(db, "productioncompany"),
        where("owners", "array-contains", userUid)
      );
      //gets document from production
      const q2 = query(
        collection(db, "production"),
        where("owners", "array-contains", userUid)
      );
      //Get company specified docs
      const querySnapshot = await getDocs(q);
      const querySnapshot2 = await getDocs(q2);
      //this variables are for company
      let arr = [];
      let i = 0;
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
      //arr to fuse both production and production company
      //let arr3 = [];
      //let y = 0;
      querySnapshot.forEach((doc) => {
        // const found = arr4.some((r) => doc.data().productions.includes(r));
        // if (found) {
        //   arr3.push({
        //     id: "parent " + y.toString(),
        //     name: doc.data().name,
        //     proCoId: doc.id,
        //     children: arr2,
        //   });
        // } else {
        //   arr3.push({
        //     id: "parent " + y.toString(),
        //     name: doc.data().name,
        //     proCoId: doc.id,
        //   });
        // }
        arr.push({
          id: (i + 1).toString(),
          name: doc.data().name,
          docId: doc.id,
        });
        i++;
        //y++;
      });

      //sets the Data for all the array elements in arry
      setData({
        id: "root",
        name: "Production Company Owned",
        children: arr,
      });
      // setData2({
      //   id: "root2",
      //   name: "Production Owned",
      //   children: arr3,
      // });
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

  //Mui dynamic rending for Treeitems Read more on https://mui.com/components/tree-view/#main-content
  const renderTree = (nodes) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );
  //When the Production Company tree item is selected
  //Get's the Node name and set's to global variabl to be used later
  function action(event, nodeId) {
    console.log("nodeId: ", nodeId);
    if (nodeId !== "root") {
      const x = JSON.parse(nodeId) - 1;
      console.log(data.children[x].docId);
      const companyNameRef = data.children[x].docId;
      setProductionCompany(companyNameRef);
      navigate("/production-company-dashboard");
    }
  }
  function action2(event, nodeId) {
    console.log("nodeId: ", nodeId);
    const x = JSON.parse(nodeId) - 1;
    if (nodeId !== "root2") {
      setProductionId(data3.children[x].proId);
      navigate("/production-dashboard");
    }
  }
  const handleProductionCompanyProfileCreate = () => {
    navigate("/production-company-profile-create");
  };

  return (
    <div>
      {!loading ? (
        <>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root"]}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect={false}
            sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action}
          >
            {renderTree(data)}
            <Button onClick={handleProductionCompanyProfileCreate}>
              Create New Company
            </Button>
          </TreeView>
          <TreeView
            aria-label="rich object"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpanded={["root2"]}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ height: 200, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
            onNodeSelect={action2}
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
