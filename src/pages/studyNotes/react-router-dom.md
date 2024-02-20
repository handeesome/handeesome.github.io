# React Router dom v6

The main content of this article are learnt from [Web Dev Simplified Blog](https://blog.webdevsimplified.com/2022-07/react-router/), and [click here](https://www.youtube.com/watch?v=Ul3y1LXxzdU) to watch his corresponding youtube video.

The article will be in four sections.

1. React Router Basics
2. Advanced Route Definitions
3. Handling Navigation
4. Routers In Depth

## React Router Basics

First, install React Router. Run <mark>npm i react-router-dom</mark>.

Once the libarary is included, there are three things you need to do in order to use React Router.

1. Setup your router
2. Define your routes
3. Handle navigation

### Setup your router

First, all you need to do is to wrap your entire application by <mark>BrowserRouter</mark>

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### Define your routes

The next step is to define your routes. This is generally done at the top level at your application, in this case ==App== component, but can be done at anywhere.

```jsx
import { Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { BookList } from "./BookList";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books" element={<BookList />} />
    </Routes>
  );
}
```

Whenever your URL changes, React Router will look at the routes you defined in your ==Routes== component and it will render the content in the ==element== prop.

The nice thing about React Router is that when you navigate between pages it will only refresh the content inside your ==Routes== component. All the rest of the content on your page will stay the same which helps with performance and user experience.
