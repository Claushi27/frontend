import React, { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const PaymentRedirectHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we're being redirected from the wrong port (5173 instead of 5174)
    const currentPort = window.location.port;
    const searchParams = new URLSearchParams(location.search);

    console.log('Payment redirect detected:', {
      currentPort,
      pathname: location.pathname,
      search: location.search
    });

    // If we detect this is a payment callback but we're on the wrong port,
    // we should have already been redirected by the browser or handled by the server
  }, [location]);

  // Pass through the search parameters to maintain the payment result data
  return <Navigate to={`/pago/resultado${location.search}`} replace />;
};

export default PaymentRedirectHandler;