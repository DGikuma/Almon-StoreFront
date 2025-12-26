import { Route, Routes } from "react-router-dom";

import StorefrontPage from "@/storefront/page";
import TrackOrderAnimated from "@/order-tracking/page";
import PrivacyConsentPage from "@/privacy-consent/page";
import PrivacyPolicyPage from "@/privacy-policy/page";
import TermsOfServicePage from "@/terms-of-service/page";

function App() {
  return (
    <Routes>
      <Route element={<StorefrontPage />} path="/" />
      <Route path="/order-tracking" element={<TrackOrderAnimated />} />
      <Route path="/privacy-consent" element={<PrivacyConsentPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
    </Routes>
  );
}

export default App;
