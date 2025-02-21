import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to="auth/login">Login</Link>
      <br />
      <Link to="books">books</Link>
    </div>
  );
};

export default Home;
