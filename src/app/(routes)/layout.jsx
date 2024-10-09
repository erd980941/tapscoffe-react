import LayoutWrapper from "../../components/LayoutWrapper";


export default function RoutesLayout({ children }) {
  return (
    <div>
        <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
}
