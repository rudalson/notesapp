import { useEffect, useReducer } from 'react';
import { API } from 'aws-amplify';
import { List } from 'antd';

import 'antd/dist/antd.css';
import { listNotes } from './graphql/queries';
import './App.css';

const styles = {
  container: { padding: 20 },
  item: { textAlign: 'left' },
};

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: '', description: '' },
};

function App() {
  function reducer(state, action) {
    switch (action.type) {
      case 'SET_NOTES':
        return { ...state, notes: action.notes, loading: false };
      case 'ERROR':
        return { ...state, loading: false, error: true };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  async function fetchNotes() {
    try {
      const notesData = await API.graphql({ query: listNotes });
      dispatch({ type: 'SET_NOTES', notes: notesData.data.listNotes.items });
    } catch (err) {
      console.log('error: ', err);
      dispatch({ type: 'ERROR' });
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  function renderItem(item) {
    return (
      <List.Item style={styles.item}>
        <List.Item.Meta title={item.name} description={item.description} />
      </List.Item>
    );
  }

  return (
    <div className='App' style={styles.container}>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  );
}

export default App;
