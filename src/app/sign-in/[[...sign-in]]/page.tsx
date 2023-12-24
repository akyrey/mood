import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn afterSignInUrl="/journal" />;
};

export default SignInPage;
