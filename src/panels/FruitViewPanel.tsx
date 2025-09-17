import React, { useState, useCallback, useMemo } from 'react';
import { MockFruitMachine, Fruit } from '../../engine/MockFruitMachine';
// Add Ant Design imports
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
  List,
  message as antdMessage,
} from 'antd';
import { COLORS } from '../constants/colors';
const { Title, Text } = Typography;

const FRUIT_LIST: Fruit[] = ['apple', 'banana', 'orange'];

const machine = new MockFruitMachine();

export const FruitViewPanel: React.FC = () => {
  const [inventory, setInventory] = useState(machine.getInventory());
  const [selectedFruit, setSelectedFruit] = useState<Fruit>('apple');
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState('');

  const fruitOptions = useMemo(
    () =>
      FRUIT_LIST.map((fruit) => (
        <Select.Option key={fruit} value={fruit}>
          {fruit}
        </Select.Option>
      )),
    []
  );

  const inventoryList = useMemo(
    () =>
      FRUIT_LIST.map((fruit) => (
        <List.Item key={fruit} style={{ padding: '4px 0' }}>
          <Text style={{ color: COLORS.fruitViewText, fontSize: 16 }}>
            {fruit}:{' '}
            <Text strong style={{ color: COLORS.fruitViewTextStrong }}>
              {inventory[fruit]}
            </Text>
          </Text>
        </List.Item>
      )),
    [inventory]
  );

  const handleBuy = useCallback(() => {
    if (machine.buy(selectedFruit, amount)) {
      setMessage(`Bought ${amount} ${selectedFruit}(s).`);
      antdMessage.success(`Bought ${amount} ${selectedFruit}(s).`);
    } else {
      setMessage(`Not enough ${selectedFruit}s in inventory.`);
      antdMessage.error(`Not enough ${selectedFruit}s in inventory.`);
    }
    setInventory(machine.getInventory());
  }, [selectedFruit, amount]);

  const handleSell = useCallback(() => {
    machine.sell(selectedFruit, amount);
    setMessage(`Sold ${amount} ${selectedFruit}(s).`);
    antdMessage.info(`Sold ${amount} ${selectedFruit}(s).`);
    setInventory(machine.getInventory());
  }, [selectedFruit, amount]);

  const handleFruitChange = useCallback((value) => {
    setSelectedFruit(value as Fruit);
  }, []);

  const handleAmountChange = useCallback((value) => {
    setAmount(Number(value));
  }, []);

  const messageColor = useMemo(() => {
    if (message.startsWith('Bought')) return COLORS.fruitViewBought;
    if (message.startsWith('Not enough')) return COLORS.fruitViewNotEnough;
    return undefined;
  }, [message]);

  return (
    <div
      className='panels'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100%',
        padding: '32px 0',
      }}
    >
      <Card
        style={{
          borderRadius: 12,
          boxShadow: `0 2px 12px ${COLORS.fruitViewBoxShadow}`,
          minWidth: 350,
          maxWidth: 400,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Title level={3} style={{ marginTop: 0, marginBottom: 24 }}>
          Fruit View
        </Title>
        <Form
          layout='inline'
          style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}
          onSubmitCapture={(e) => e.preventDefault()}
        >
          <Form.Item label='Fruit'>
            <Select
              value={selectedFruit}
              onChange={handleFruitChange}
              style={{ width: 120 }}
              getPopupContainer={() => document.body}
              popupMatchSelectWidth={false}
              classNames={{ popup: { root: 'fruit-select-dropdown' } }}
            >
              {fruitOptions}
            </Select>
          </Form.Item>
          <Form.Item label='Amount'>
            <InputNumber
              min={1}
              value={amount}
              onChange={handleAmountChange}
              style={{ width: 80 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleBuy}>
              Buy
            </Button>
            <Button type='default' onClick={handleSell}>
              Sell
            </Button>
          </Form.Item>
        </Form>
        <div style={{ minHeight: 24, marginBottom: 16 }}>
          {message && (
            <Text strong style={{ color: messageColor }}>
              {message}
            </Text>
          )}
        </div>
        <Title level={4} style={{ marginBottom: 8 }}>
          Inventory
        </Title>
        <List size='small'>{inventoryList}</List>
      </Card>
    </div>
  );
};
