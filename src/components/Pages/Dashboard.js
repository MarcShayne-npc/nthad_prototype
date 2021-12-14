import React from "react";

export default function Dashboard({ productionId, positionId }) {
  return (
    <div>
      <>{productionId}</>
      Dashboard Page
      <>{positionId}</>
    </div>
  );
}
