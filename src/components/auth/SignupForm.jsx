import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("회원가입 완료");

    location.href = "/login";
  };

  return (
    <div className="auth-card">
      <h2>회원가입</h2>

      <input
        type="email"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button onClick={handleSignup}>
        회원가입
      </button>
    </div>
  );
}