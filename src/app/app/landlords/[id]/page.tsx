import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LandlordDetailView from "@/components/Landlords/LandlordDetailView";
import React from "react";

const LandlordDetailPage = () => {
  const firstParent = { title: "Landlords", href: "/app/landlords" };
  return (
    <div>
      <PageBreadcrumb pageTitle="Landlord" firstParent={firstParent} />

      <LandlordDetailView />
    </div>
  );
};

export default LandlordDetailPage;
