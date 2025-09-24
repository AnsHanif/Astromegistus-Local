import SettingsModeLayout from '../_components/settings-mode-layout';
import ContactUsPage from './_components/contact-us-page';

function ContactUs() {
  return (
    <SettingsModeLayout
      heading="Contact Us"
      subheading="We're here to help and answer your questions."
    >
      <ContactUsPage />
    </SettingsModeLayout>
  );
}

export default ContactUs;
