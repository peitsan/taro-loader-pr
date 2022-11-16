import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import logo from "../../assets/logo.png";
import "./login.less";
import { userLogin } from "../../utils/params";
import httpUtil from "../../utils/httpUtil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "../../redux/hooks";
import { updateUserInfoAC } from "../../redux/actionCreators";

type IdentityType = {
  id: number;
  nickname: string;
  permission: string;
  username: string;
  teams: any[];
};

export const Login = () => {
  const dispatch = useDispatch();

  const Wrapper = (props: any) => {
    return (
      <div className="wrapper">
        <div className="login-wrapper">
          {props.children}
          <img className="logo" src={logo} alt="logo"></img>
        </div>
      </div>
    );
  };

  const FormLogin = () => {
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values: userLogin) => {
      try {
        setLoginLoading(true);
        const res = await httpUtil.userLogin(values);
        const user: IdentityType = res.data?.user;
        const token: string = res.data?.token;
        const { permission, teams, id } = user;
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("permission", permission);
        sessionStorage.setItem("id", String(id));
        sessionStorage.setItem("teams", JSON.stringify(teams));
        sessionStorage.setItem("token", token);
        dispatch(updateUserInfoAC(user));
        message.success(`欢迎您，${user.nickname || "用户"}`);
        permission === "admin"
          ? navigate("/home/managerManage")
          : navigate("/home/projectManage/projectOverview");
      } finally {
        setLoginLoading(false);
      }
    };

    const onReset = () => {
      form.resetFields();
    };

    return (
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: "请输入账号" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 15, span: 24 }}>
          <Button
            loading={loginLoading}
            type="primary"
            htmlType="submit"
            style={{ marginRight: 20 }}
          >
            登录
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Wrapper>
      <FormLogin></FormLogin>
    </Wrapper>
  );
};
