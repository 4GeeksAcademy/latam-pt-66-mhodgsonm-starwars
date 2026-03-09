import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Details } from "./pages/Details";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />} errorElement={<h1 style={{color:"#ffe81f",textAlign:"center",marginTop:"4rem"}}>Not found!</h1>}>
        <Route index element={<Home />} />
        <Route path="/people/:uid" element={<Details type="people" />} />
        <Route path="/vehicles/:uid" element={<Details type="vehicles" />} />
        <Route path="/planets/:uid" element={<Details type="planets" />} />
      </Route>
    )
);
