import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreatePropertyForm from "@/components/properties/CreatePropertyForm";
import React from "react";

const CreatePropertyPage = () => {
  const firstParent = { title: "Properties", href: "/app/properties" };

  return (
    <div>
      <PageBreadcrumb pageTitle="Add Property" firstParent={firstParent} />
      <CreatePropertyForm />
    </div>
  );
};

export default CreatePropertyPage;
