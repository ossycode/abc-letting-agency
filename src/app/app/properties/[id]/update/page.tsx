import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UpdatePropertyForm from "@/components/properties/UpdatePropertyForm";
import React from "react";

const PropertyUpdatePage = () => {
  const firstParent = { title: "Properties", href: "/app/properties" };
  return (
    <div>
      <PageBreadcrumb pageTitle="Update" firstParent={firstParent} />
      <UpdatePropertyForm />
    </div>
  );
};

export default PropertyUpdatePage;
