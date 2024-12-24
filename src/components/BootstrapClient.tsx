"use client"
//import { useEffect } from 'react';
import Script from "next/script";

function BootstrapClient() {
  // useEffect(() => {
  //   require('bootstrap/dist/js/bootstrap.bundle.min.js');
  // }, []);

  // return null;
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-XXXXXX"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => console.log("Bootstrap JS loaded")}
      />
    </>
  );
}

export default BootstrapClient;