import app from './App';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
