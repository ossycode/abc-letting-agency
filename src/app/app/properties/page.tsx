import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PropertyListTable from "@/components/properties/PropertyListTable";
import React from "react";

const PropertiesPage = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Properties" showPageTitle={false} />
      <PropertyListTable />
    </div>
  );
};

export default PropertiesPage;
