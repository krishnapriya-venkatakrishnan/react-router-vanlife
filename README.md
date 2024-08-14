## React- Vanlife using react-router-dom

### Overview
Vanlife is an online web application that uses firestore for data management. The user can rent a van, post a review for the rented van.
The user has their own dashboard, income with their transaction details and a section for their owned vans.

### Tree View
Displayed using ReacTree

![Tree1](https://github.com/user-attachments/assets/3f7eb32b-c53c-49de-9e38-9f8ae5f79c6b)

![Tree2](https://github.com/user-attachments/assets/49ccfc1d-31b3-4335-9c74-0f616b86547f)

### env.js
- Firestore configuration are to be set here.

### Components and its usage
- App: This component uses react-router-dom, to enable routing among different links.
    - BrowserRouter: Top-level component that wraps around your application to enable React Router.
    - Routes: Container component that houses all the Route components. It looks through all its children Route elements and renders the first one that matches the current location.
    - Route: Route is used to define a specific route within the Routes component. It maps a URL path to a React component, which will be rendered when the path matches the current URL.
    - "/" path wraps the rest of the routes. In this application, the navigation bar is shared among all the routes. Hence, a layout component for it is defined.
      In addition to the layout, the home page is also displayed. To include this, "index" attribute is used in Route, since it is the same path and the respective "element" is linked.
    - Layout component:
        - "Outlet" component is imported from "react-router-dom". This is done to include the children ie., the routes specified in App.jsx.
        - Layout renders Header, Outlet, and Footer component. Context is created to hold the logged in user's information.
            - Header component: Displays the logo, logged in user, and links to Host, Vans, About, Cart pages. Supports user log in and log out.
              The active link needs to be highlighted. Hence, "NavLink" component is used. Else, in general "Link" component is used.
              Ex., <mark><NavLink to = "/host" className={({isActive}) => isActive ? "active": null}></mark>
            - Footer component: Dislays the copy right information.
    - Home component: This shows a welcome message and a link to find a van. When clicked, list of vans would be displayed.
    - About component: This is similar to the Home component. The link to explore lists vans.
    - Login component: When the user icon is clicked, it directs to the login page. This page displays a form to get the user's credentials and the form is validated.
      Incorrect credentials lead to an error. New user can be created by clicking on "Create account" button. This directs to signup page.
      The login page is automatically redirected, when the host details are searched. This is verified using <mark>useLocation() and useNavigate() hooks</mark>.
        - The "state" property of useLocation() holds the path from which the login page is directed(set in AuthRequiredLayout- location.state.redirectTo).
        - navigate function has 2 parameters. The first parameter would be the path stored in location.state.redirectTo, else "/host" by default.
          The second parameter is to replace the login page({replace: true}).
    - Signup component: This component renders a form to get the user's name, email, and password information. Once the submit button is clicked, the data 
      is updated in the firestore. This then directs back to the Login page.
    - AuthRequiredLayout component: This layout component is used for authentication purpose. If the user is logged in, then Host page is displayed.
        If the user is not logged in, it is directed to the login page(using Navigate component).
        Then Outlet component is rendered.
        Note: Since it is for validation and no page is directed for this layout, only element attribute is suffice in <Route> in App.jsx.
          - HostLayout component: Establishes link to Dashboard, Income, and Vans page using NavLink component, followed by Outlet component.
              - Dashboard component: This is the home page for the host.
                  This displays 3 sections.
                  1. Displays transaction amount of the user.
                      - When clicked, it displays the transaction amount graph.
                  2. Displays the host's review score.
                  3. Displays the host's vans.
                      - To view all the vans, "View all" button should be clicked.
                      - To view a van, select the respective van link.
              
              - Income component: This displays 2 sections.
                  1. Income transactions graph.
                      - VictoryChart component is used to display the graph.
                  2. List of transactions.

              - HostVans component: The host can add a van or delete the van.
                  - When "Add van" button is clicked, a form is displayed to get the van details.
                      - EditVanDetails component is triggered.
                          - A form is displayed to get the van details.
                          - Whenever a photo is added, the link is added along with a delete link.
                              - When delete link is clicked, the photo is removed from the van's data.
                          - When Done editing! button is clicked, the van details are added in the firestore.
                  - List of the host's vans are displayed, along with a delete link. Once clicked, the van data is removed.

              - HostVanDetailLayout component: This layout component has the van's profile photo, category, name, price, and a list of links(NavLink).
                "context" attribute in Outlet element is set, which is referred in the links using useOutletContext() hook.
                  - HostVanDetails component: Displays name, category, description, and visibility.
                  - HostVanPricing component: Displays the van's price.
                  - HostVanPhotos component: Displays the van's photos.
    
    - DisplayVansInGrid component: This displays all the vans from the firestore. This page has a filter option based on van's category.
        - useSearchParams() hook is used for the filtering process.
            - when any of the categories is clicked, searchParams is set with an object.
                - Ex., const [searchParams, setSearchParams] = useSearchParams()
                - const typeFilter = searchParams.get("type")
                - onClick={setSearchParams({type: "simple"})}

        - ReturnVanInGrid component: Called from DisplayVansInGrid component. Vans in grid are returned.
            Link to each van page is set here along with "state" attribute.
    
    - DisplaySelectedVan component:
        - The van ID from the url is fetched from useParams() hook.
        - Link to the previous page is diplayed.
        - Selected van details are diplayed.
        - When "Rent this van" button is clicked, the van detail is added to the cart, with an animation effect.
          The cart details are added to the local storage.
        - If the logged in user had rented out the van, the review form is displayed. When "Post review" button is clicked, the details are updated in firestore.
        - Reviews component:
            - Reviews graph is displayed.
            - Review details are displayed. Latest reviews are displayed on top.

    - Cart component: It displays the cart details.
        - Whenever the van is rented, the cart details are updated.
        - In this Cart page, the user can add or delete the van.
        - When "Pay" button is clicked, the transaction details are updated in the firestore.
          *No actual payment is done here.*

    - NotFound component: When the routing path is not matched, then "Sorry, the page you were looking for was not found." message is dislpayed
      and a link to the home page is included.

### Firestore Database:
  - hosts collection
      - *email id* as document ID
          - currentMonthTxnAmount, totalTxnAmount, monthlyTxnAmount- [{month, year}], txnDetails- [txnAmount, txnDate] fields
  - users collection
      - *email id* as document ID
          - email, password, name fields
  - vans collection
      - *van id* as document ID
          - description, hostId, imageUrl- [{name, url}], name, photos- [{name, url}], price, reviews- [{date, description, stars, user}], type, visibility fields.

### Storage:
  - *van ID* folder
      - *photos* folder
      - *profile* folder

### api.jsx
  - API calls to firestore are handled here.

### Live Demo
*Make sure to set env.js.*
*Log in with username b@b.com and password as p123 to see the host details including the transactions.*
*To post a review, make sure to rent the van first.*
*Once paid, the owner of the van's host>income gets updated.*

(https://66bc95639028ae7382537252--famous-fenglisu-54cca7.netlify.app/)
