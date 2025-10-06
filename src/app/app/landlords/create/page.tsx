import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateLandlordForm from "@/components/Landlords/CreateLandlordForm";
import React from "react";

const CreateLandlordPage = () => {
  const firstParent = { title: "Landlords", href: "/app/landlords" };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Landlord" firstParent={firstParent} />
      <CreateLandlordForm />
    </div>
  );
};

export default CreateLandlordPage;
