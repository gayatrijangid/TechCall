import "../App.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landingPageContainer">

      {/* Navbar */}
<nav>
  <h2>
    Tech<span>Call</span>
  </h2>

  <Link to="/auth" className="loginBtn">
    Login
  </Link>
</nav>
      {/* Hero */}
      <section className="heroSection">

        <h1>
          Real-Time Video
          <br />
          <span>Coding Interviews</span>
        </h1>

        <p>
          Collaborate seamlessly with video calls,
          live coding, chat and screen sharing.
        </p>

        <div className="heroButtons">
          <Link to="/auth" className="primaryBtn">
            Get Started
          </Link>

        </div>

      </section>

      {/* Screenshot */}
      <section className="imageSection">
        <img src="/proimg.png" alt="TechCall" />
      </section>

      {/* Features */}
      <section className="featureSection">

        <h2>Why Choose TechCall?</h2>

        <div className="featureGrid">

          <div className="card">
            <h3>Video Collaboration</h3>
            <p>Communicate face-to-face during meetings.</p>
          </div>

          <div className="card">
            <h3>Live Coding</h3>
            <p>Code together in real time.</p>
          </div>

          <div className="card">
            <h3>Chat</h3>
            <p>Instant communication during meetings.</p>
          </div>

          <div className="card">
            <h3>Screen Sharing</h3>
            <p>Share your work easily.</p>
          </div>

          <div className="card">
            <h3>Meeting History</h3>
            <p>View previous meetings with room codes and dates.</p>
          </div>

          <div className="card">
            <h3>Anywhere Access</h3>
            <p>Works on every device.</p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer>
        <h2>
          Tech<span>Call</span>
        </h2>

        <p>
          Real-time collaborative coding interviews.
        </p>
      </footer>

    </div>
  );
};

export default LandingPage;