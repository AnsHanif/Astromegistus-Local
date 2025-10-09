import SettingsModeLayout from '../_components/settings-mode-layout';
import EditPasswordPage from './_components/edit-password-page';

const Page = () => {
  return (
    <SettingsModeLayout
      heading="Edit Password"
      subheading="Customize your experience and preferences."
    >
      <EditPasswordPage />
    </SettingsModeLayout>
  );
};

export default Page;
