import { Box, Container } from "@mui/system";
import { Provider } from "../context/mainContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Container maxWidth="sm">
        <Box textAlign="center" mt={5}>
          <Component {...pageProps} />
        </Box>
      </Container>
    </Provider>
  );
}
