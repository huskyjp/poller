import React from "react";
import { Formik, Form } from "formik";
import { Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  // hooks to handle registration change
  // const [, register] = useMutation(REGISTER_MUT);
  const router = useRouter();
  const [, register] = useRegisterMutation(); // custom hook from generator and get GrahQL Mutation Code
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }} // {{}} -> passing objects by{}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          // function to handle when user click register
          const response = await register(values);
          if (response.data?.register.errors) {
            // pass the indicated error then show
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <InputField
              name="password"
              placeholder="password"
              label="password"
            />
            <Button mt={4} type="submit" isLoading={isSubmitting} color="teal">
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
