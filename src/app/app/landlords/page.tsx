import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LandlordListTable from "@/components/Landlords/LandlordListTable";
import React from "react";

const AllLandlordsPage = () => {
  return (
    // <ComponentCard title="Data Table 2">
    //   <DataTableTwo />
    // </ComponentCard>
    <div>
      <PageBreadcrumb pageTitle="Landlords" />
      <LandlordListTable />
    </div>
  );
};

export default AllLandlordsPage;
