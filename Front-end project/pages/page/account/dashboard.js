import React, { useEffect, useState } from "react";
import CommonLayout from '../../../components/shop/common-layout';
import { useRouter } from "next/router";
import Link from "next/link";
import {
    Container,
    Row,
    Col,
    Media,
    Card,
    CardBody,
    Input,
    NavItem,
    NavLink,
    TabContent,
    Nav,
    TabPane,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
    Label,
} from "reactstrap";
import seventeen from "../../../public/assets/images/logos/17.png";
import order from "../../../public/assets/images/icon/dashboard/order.png";
import sale from "../../../public/assets/images/icon/dashboard/sale.png";
import follow from "../../../public/assets/images/icon/dashboard/follow.png";
import homework from "../../../public/assets/images/icon/dashboard/homework.png";
import one from "../../../public/assets/images/dashboard/product/1.jpg";
import nine from "../../../public/assets/images/dashboard/product/9.jpg";
import thirtyfour from "../../../public/assets/images/pro3/34.jpg";
import pro1 from "../../../public/assets/images/pro3/1.jpg";
import pro27 from "../../../public/assets/images/pro3/27.jpg";
import pro36 from "../../../public/assets/images/pro3/36.jpg";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { apexPieChart, lineChart1 } from "../../../data/vendorData";
import AddProduct from "../../../components/common/AddProduct";
import { Form, FormGroup, FormText, ResponsiveEmbed } from "react-bootstrap";
import EditProfile from "../../../components/common/EditProfile";
import EditProduct from "../../../components/common/EditProduct";
import { DeleteOrder, OrderData } from "../../../services/Order.Services";
import { CurrentUser, RoleAuthenticated, UpdateUser } from "../../../services/User.Services";
import OrderDetail from "./orderDetail";
import Following from "./Following";
import ProfilePage from "./common/profile-page";


const Summary = ({ img, title, desc }) => {
    return (
        <Col md="4">
            <div className="counter-box">
                <Media src={img} className="img-fluid" />
                <div>
                    <h3>{title}</h3>
                    <h5>{desc}</h5>
                </div>
            </div>
        </Col>
    );
};


const ProfileData = [
    { title: "Company Name", detail: "Fashion Store" },
    { title: "Email Address", detail: "Mark.Enderess@Mail.Com" },
    { title: "Country / Region", detail: "Downers Grove, IL" },
    { title: "Year Established", detail: "2021" },
    { title: "Total Employees", detail: "101 - 200 People" },
    { title: "Category", detail: "Clothing" },
    { title: "Street Address", detail: "549 Sulphur Springs Road" },
    { title: "City/State", detail: "Downers Grove, IL" },
    { title: "Zip", detail: "60515" },
];

const ProfileDetail = ({ title, detail }) => {
    return (
        <li>
            <div className="details">
                <div className="left">
                    <h6>{title}</h6>
                </div>
                <div className="right">
                    <h6>{detail}</h6>
                </div>
            </div>
        </li>
    );
};



//const currentUser = CurrentUser("milronfre");
const Dashboard = () => {


    const router = useRouter();
    const [activeTab, setActiveTab] = useState("1");
    const [EditProductId, setEditProductId] = useState();
    const [orderSelected, setOrderSelected] = useState({});
    const [orderData, setOrderData] = useState([]);

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [accountInfo, setAccountInfo] = useState(false)
    const [following, setFollowing] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [userName, setUserName] = useState(null);
    const [role, setRole] = useState(null);

    const SummaryData = [
        {
            img: order,
            title: orderData ? orderData.length : 0,
            desc: "Total Orders",
        },
        {
            img: sale,
            title: following ? following.length : 0,
            desc: "Following",
        },
        {
            img: homework,
            title: currentUser?currentUser.points:0,
            desc: "Cuppon points",
        },
    ];

    useEffect(() => {
        setRole(RoleAuthenticated());
    }, [activeTab]);

    useEffect(() => {
        CurrentUser()
            .then(resp => {
                console.log(resp);
                setCurrentUser(resp);
                setOrderData(resp.orders);
                setFollowing(resp.sellersFollowed)
            })
            .catch();

    }, [activeTab])

    
    useEffect(() => {
        if (!RoleAuthenticated() || RoleAuthenticated().toUpperCase() != 'BUYER')
            router.push("/page/account/login");
    }, []);
    const saveProfileClickHandle=()=>{
        UpdateUser(currenteUser);
        setActiveTab(1);
    }
    const deleteOrderEventHandler = (orderId) => {
        var answer = window.confirm("Delete Order?");
        if (answer) {
            setOrderData(DeleteOrder(orderId));
        }
    }
    const RecentOrder = ({ ord }) => {
        return (
            <tr>
                <th scope="row">{ord.id}</th>
                <td>{ord.createdOn}</td>
                <td>{ord.orderStatus}</td>
                <td>
                    <i onClick={() => { setActiveTab("9"); setOrderSelected(ord); }} className="fa fa-search-plus mr-1" aria-hidden="true"></i>
                    {ord.orderStatus != 'Shipped' ? <i className="fa fa-trash-o ml-1" aria-hidden="true" onClick={() => deleteOrderEventHandler(ord.id)} ></i> : <i></i>}
                </td>
            </tr>
        );
    };

    const AllOrder = ({ ord }) => {
        return (
            <tr>
                <th scope="row">{ord.id}</th>
                <td>{ord.createdOn}</td>
                <td>{ord.orderStatus}</td>
                <td>
                    <i onClick={() => { setActiveTab("9"); setOrderSelected(ord); }} className="fa fa-search-plus mr-1" aria-hidden="true"></i>
                    {ord.orderStatus != 'Shipped' ? <i className="fa fa-trash-o ml-1" aria-hidden="true" onClick={() => deleteOrderEventHandler(ord.id)} ></i> : <i></i>}
                </td>
            </tr>
        );
    };

    return (
        <React.Fragment>
            <CommonLayout parent="home" title="dashboard">
                <section className="section-b-space">
                    <Container>
                        <Row>
                            <Col lg="3">
                                <div className="dashboard-sidebar">
                                    <div className="profile-top">
                                        <div className="profile-detail">
                                            <h3>{currentUser && currentUser.user ? currentUser.user.fname : ''}
                                                {currentUser && currentUser.user ? currentUser.user.lname : ''}</h3>
                                            <h6>{currentUser && currentUser.user ? currentUser.user.email : ''}</h6>
                                        </div>
                                    </div>
                                    <div className="faq-tab">
                                        <Nav tabs className="border-tab-primary">
                                            <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                                                <NavLink
                                                    className={activeTab === "1" ? "active" : ""}
                                                    onClick={() => setActiveTab("1")}
                                                >
                                                    Dashboard
                                                </NavLink>
                                            </NavItem>
                                            <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                                                <NavLink
                                                    className={activeTab === "2" ? "active" : ""}
                                                    onClick={() => setActiveTab("2")}
                                                >
                                                    Following
                                                </NavLink>
                                            </NavItem>
                                            <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                                                <NavLink
                                                    className={activeTab === "3" ? "active" : ""}
                                                    onClick={() => setActiveTab("3")}
                                                >
                                                    Order History
                                                </NavLink>
                                            </NavItem>
                                            <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                                                <NavLink
                                                    className={activeTab === "4" ? "active" : ""}
                                                    onClick={() => setActiveTab("4")}
                                                >
                                                    Profile
                                                </NavLink>
                                            </NavItem>
                                            
                                        </Nav>
                                    </div>
                                </div>
                            </Col>
                            <Col lg="9">
                                <div className="faq-content">
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1">
                                            <div className="counter-section">
                                                <Row>
                                                    {SummaryData.map((data, i) => {
                                                        return (
                                                            <Summary
                                                                key={i}
                                                                img={data.img}
                                                                title={data.title}
                                                                desc={data.desc}
                                                            />
                                                        );
                                                    })}
                                                </Row>
                                            </div>
                                              <Row>
                                                <Col lg="12">
                                                    <Card className="dashboard-table">
                                                        <CardBody>
                                                            <h3>recent orders</h3>
                                                            <table className="table mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">order id</th>
                                                                        <th scope="col">date</th>
                                                                        <th scope="col">status</th>
                                                                        <th scope="col"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {orderData.slice(0, 5).map((data, i) => {
                                                                    return (
                                                                        <RecentOrder
                                                                            key={i}
                                                                            ord={data}
                                                                        />
                                                                    );
                                                                })} 
                                                                </tbody>
                                                            </table>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="2">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="dashboard-table mt-0">
                                                        <CardBody>
                                                            <Following Following={following}></Following>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="3">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="dashboard-table mt-0">
                                                        <CardBody>
                                                            <div className="top-sec">
                                                                <h3>Order History</h3>
                                                            </div>
                                                            <table className="table table-responsive-sm mb-0">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">order id</th>
                                                                        <th scope="col">date</th>
                                                                        <th scope="col">status</th>
                                                                        <th scope="col"></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                     {orderData.map((data, i) => {
                                                                    return (
                                                                        <AllOrder
                                                                            key={i}
                                                                            ord={data}
                                                                        />
                                                                    );
                                                                })} 
                                                                </tbody>
                                                            </table>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="4">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <div className="dashboard-box">
                                                                
                                                                <div className="dashboard-detail">
                                                                    <ul>
                                                                        <section className="contact-page register-page">
                                                                            {currentUser && currentUser.user ?
                                                                            <Container>
                                                                                <Row>
                                                                                    <Col sm="12">
                                                                                        <h3>PERSONAL DETAIL</h3>
                                                                                        <Form className="theme-form">
                                                                                            <Row>
                                                                                                <Col md="6">
                                                                                                    <Label for="name">First Names</Label>
                                                                                                    <Input type="text" className="form-control" id="name"
                                                                                                        onChange={(e) => { 
                                                                                                            let usr={...currentUser};
                                                                                                            usr.user.fname=e.target.value;
                                                                                                            setCurrentUser(usr);
                                                                                                         }}
                                                                                                        value={currentUser.user.fname} placeholder="Enter Your name"
                                                                                                        required />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="email">Last Name</Label>
                                                                                                    <Input type="text" className="form-control" id="last-name" 
                                                                                                    onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.user.lname=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.user.lname} placeholder="Last name" required />
                                                                                                </Col>

                                                                                                <Col md="6">
                                                                                                    <Label for="review">Phone number</Label>
                                                                                                    <Input type="text" maxLength='9' className="form-control" id="review" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.user.phone=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.user.phone?currentUser.user.phone:''} placeholder="Enter your number"
                                                                                                         />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="email">Email</Label>
                                                                                                    <Input type="text" className="form-control" id="email" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.user.email=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.user.email} placeholder="Email" required />
                                                                                                </Col>

                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col md="12">
                                                                                                    <h3>SHIPPING ADDRESS</h3>
                                                                                                </Col>
                                                                                            </Row>

                                                                                            <Row>
                                                                                                <Col md="6">
                                                                                                    <Label for="name">Address Line</Label>
                                                                                                    <Input type="text" className="form-control" id="home-ploat"
                                                                                                    value={currentUser.shippingAddress.addressLine?currentUser.shippingAddress.addressLine:''} 
                                                                                                    
                                                                                                    placeholder="company name"
                                                                                                        required />
                                                                                                </Col>
                                                                                                <Col md="6" className="select_input">
                                                                                                    <Label for="review">Country *</Label>
                                                                                                    <Input type="text" className="form-control" id="address-two" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.shippingAddress.country=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.shippingAddress.country} placeholder="Address"
                                                                                                        required="" />
                                                                                                    {/* <select className="form-control" size="1">
                                            <option value="India">India</option>
                                            <option value="UAE">UAE</option>
                                            <option value="U.K">U.K</option>
                                            <option value="US">US</option>
                                        </select> */}
                                                                                                </Col>


                                                                                                <Col md="6">
                                                                                                    <Label for="review">Region/State *</Label>
                                                                                                    <Input type="text" className="form-control" id="region-state" 
                                                                                                    onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.shippingAddress.state=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.shippingAddress.state} placeholder="Region/state"
                                                                                                        required="" />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="review">City *</Label>
                                                                                                    <Input type="text" className="form-control" id="city" 
                                                                                                    onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.shippingAddress.city=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.shippingAddress.city} placeholder="City" required="" />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="email">Zip Code *</Label>
                                                                                                    <Input type="text" className="form-control" id="zip-code" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.shippingAddress.zipCode=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.shippingAddress.zipCode} placeholder="zip-code"
                                                                                                        required="" />
                                                                                                </Col>

                                                                                            </Row>

                                                                                            <Row>
                                                                                                <Col md="12">
                                                                                                    <h3>BILLING ADDRESS</h3>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col md="6">
                                                                                                    <Label for="name">Address Line</Label>
                                                                                                    <Input type="text" className="form-control" id="home-ploat" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.billingAddress.addressLine=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.billingAddress.addressLine} placeholder="company name"
                                                                                                        required="" />
                                                                                                </Col>
                                                                                                <Col md="6" className="select_input">
                                                                                                    <Label for="review">Country *</Label>
                                                                                                    <Input type="text" className="form-control" id="address-two" 
                                                                                                    onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.billingAddress.country=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.billingAddress.country} placeholder="Address"
                                                                                                        required="" />
                                                                                                    {/* <select className="form-control" size="1">
                                            <option value="India">India</option>
                                            <option value="UAE">UAE</option>
                                            <option value="U.K">U.K</option>
                                            <option value="US">US</option>
                                        </select> */}
                                                                                                </Col>


                                                                                                <Col md="6">
                                                                                                    <Label for="review">Region/State *</Label>
                                                                                                    <Input type="text" className="form-control" id="region-state" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.billingAddress.state=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.billingAddress.state} placeholder="Region/state"
                                                                                                        required="" />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="review">City *</Label>
                                                                                                    <Input type="text" className="form-control" id="city" 
                                                                                                    onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.billingAddress.city=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.billingAddress.city} placeholder="City" required="" />
                                                                                                </Col>
                                                                                                <Col md="6">
                                                                                                    <Label for="email">Zip Code *</Label>
                                                                                                    <Input type="text" className="form-control" id="zip-code" 
                                                                                                     onChange={(e) => { 
                                                                                                        let usr={...currentUser};
                                                                                                        usr.billingAddress.zipCode=e.target.value;
                                                                                                        setCurrentUser(usr);
                                                                                                     }}
                                                                                                    value={currentUser.billingAddress.zipCode} placeholder="zip-code"
                                                                                                        required="" />
                                                                                                </Col>
                                                                                                <div className="col-md-12">
                                                                                                    <button className="btn btn-sm btn-solid" onClick={saveProfileClickHandle}>Save setting</button>
                                                                                                </div>
                                                                                            </Row>
                                                                                        </Form>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Container>
                                                                            :''}
                                                                        </section>


                                                                        {/* {ProfileData.map((data, i) => {
                                                                        return (
                                                                            <ProfileDetail
                                                                                key={i}
                                                                                title={data.title}
                                                                                detail={data.detail}
                                                                            />
                                                                        );
                                                                    })} */}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="5">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <div className="dashboard-box">
                                                                <div className="dashboard-title">
                                                                    <h4>settings</h4>
                                                                </div>
                                                                <div className="dashboard-detail">
                                                                    <div className="account-setting">
                                                                        <Form>
                                                                            <FormGroup>
                                                                                <Label for="storename">Store Name</Label>
                                                                                <Input type="text" name="storename" id="storename" placeholder="write the store name" />
                                                                            </FormGroup>
                                                                            <FormGroup>
                                                                                <Label for="storeurl">store url</Label>
                                                                                <Input type="text" name="s" id="storeurl" placeholder="store url here" />
                                                                            </FormGroup>

                                                                            <Button>create store</Button>
                                                                        </Form>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="6">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <AddProduct />
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="7">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <EditProfile />
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="8">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <EditProduct EditProductId={EditProductId} />
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tabId="9">
                                            <Row>
                                                <Col sm="12">
                                                    <Card className="mt-0">
                                                        <CardBody>
                                                            <OrderDetail Order={orderSelected} />
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </TabPane>

                                    </TabContent>
                                    <Modal isOpen={modal} toggle={toggle} centered>
                                        <ModalHeader toggle={toggle}>Logging Out</ModalHeader>
                                        <ModalBody className="p-4">Do you want to logout?</ModalBody>
                                        <ModalFooter>
                                            <Link href={"/"}>
                                                <a className="btn-solid btn-custom" color="secondary">
                                                    Yes
                                                </a>
                                            </Link>
                                            <Button
                                                className="btn-solid btn-custom"
                                                color="secondary"
                                                onClick={toggle}
                                            >
                                                No
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </CommonLayout>
        </React.Fragment>
    )
}

export default Dashboard