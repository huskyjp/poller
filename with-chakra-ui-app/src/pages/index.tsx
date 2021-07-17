import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createurqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <NavBar />
    <div>Hello World Next.js</div>
  </>
);
export default withUrqlClient(createurqlClient)(Index);
