import Divider from "@/components/Divider";
import AuthenticatorTypeArea from "./AuthenticatorTypeArea";
import RegisterArea from "./RegisterArea";
import Headline from "@/components/Headline";
import TableOfContent from "@/components/TableOfContent";

export const metadata = {
  title: "Universal Authentication",
};

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto mt-20 space-y-5 mb-20 p-10 md:p-0 flex flex-row-reverse relative space-x-10">
      <div className="sticky top-20 h-20 w-96 hidden md:inline-block">
        <TableOfContent />
      </div>
      <div>
        <main id="registration">
          <article className="prose lg:prose-xl">
            <h1 className="text-indigo-600">
              Welcome to Universal Authentication interactive demo!
            </h1>
            <p className="font-light">
              What is Universal Authentication? It is a new way to authenticate
              users without passwords. It uses WebAuthn is a web standard that
              provides a secure and easy-to-use authentication mechanism for web
              applications. It allows users to authenticate themselves using
              biometric factors such as fingerprints or facial recognition, or
              by using a physical security key. WebAuthn is designed to be
              resistant to phishing attacks and other forms of online fraud, and
              it provides a higher level of security than traditional
              password-based authentication methods.
            </p>
            <Headline
              title={"Registration"}
              level={2}
              className="text-indigo-600 decoration-indigo-500"
            />
            <Divider>Section 1</Divider>
            <blockquote>
              <p className="text-lg">
                First demo is a simple registration form. It will ask you to
                enter your username, but you dont need to enter a password.
                Instead, you will be asked to use your fingerprint or face to
                authenticate yourself.
              </p>
            </blockquote>
          </article>
          <RegisterArea />
        </main>
        <main id="authenticator-type">
          <Divider>Section 2</Divider>
          <article className="prose lg:prose-xl">
            <Headline
              title={"Authenticator Type"}
              level={3}
              className="text-indigo-600 decoration-indigo-500"
            />
            <p className="font-light">
              There are two types of authenticators: platform authenticators and
              cross-platform authenticators. Platform authenticators are built
              into the operating system and can only be used on the device where
              they are installed. Cross-platform authenticators are installed on
              a device and can be used on any device that supports WebAuthn.
            </p>
            <AuthenticatorTypeArea />
          </article>
        </main>
      </div>
    </main>
  );
}
