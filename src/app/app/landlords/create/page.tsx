import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateLandlordForm from "@/components/Landlords/CreateLandlordForm";
import React from "react";

const page = () => {
  const firstParent = { title: "Landlords", href: "/app/landlords" };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Landlord" firstParent={firstParent} />
      <CreateLandlordForm />
    </div>
  );
};

export default page;
