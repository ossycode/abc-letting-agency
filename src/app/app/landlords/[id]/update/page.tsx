import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UpdateLandlordForm from "@/components/Landlords/UpdateLandlordForm";
import React from "react";

const UpdateLandlordPage = () => {
  const firstParent = { title: "Landlords", href: "/app/landlords" };
  return (
    <div>
      <PageBreadcrumb pageTitle="Update" firstParent={firstParent} />
      <UpdateLandlordForm />
    </div>
  );
};

export default UpdateLandlordPage;
