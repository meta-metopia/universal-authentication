import { ContainedLoadingButton } from "@/components/LoadingButtons";
import TextField from "@/components/TextField";
import RegisterArea from "./RegisterArea";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import Tasks from "@/components/Tasks";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto mt-20 space-y-5 mb-20 p-10 md:p-0">
      <article className="prose lg:prose-xl">
        <h1>Welcome to Universal Authentication interactive demo!</h1>
        <p className="font-light">
          What is Universal Authentication? It is a new way to authenticate
          users without passwords. It uses WebAuthn is a web standard that
          provides a secure and easy-to-use authentication mechanism for web
          applications. It allows users to authenticate themselves using
          biometric factors such as fingerprints or facial recognition, or by
          using a physical security key. WebAuthn is designed to be resistant to
          phishing attacks and other forms of online fraud, and it provides a
          higher level of security than traditional password-based
          authentication methods.
        </p>
        <Divider>Section 1</Divider>
        <blockquote>
          <p>
            First demo is a simple registration form. It will ask you to enter
            your username, but you don't need to enter a password. Instead, you
            will be asked to use your fingerprint or face to authenticate
            yourself.
          </p>
        </blockquote>
      </article>
      <RegisterArea />
      <Divider />
    </main>
  );
}
