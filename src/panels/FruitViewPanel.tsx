import React, { useState } from 'react';
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
const { Title, Text } = Typography;

const fruitList: Fruit[] = ['apple', 'banana', 'orange'];
const machine = new MockFruitMachine();

export const FruitViewPanel: React.FC = () => {
  const [inventory, setInventory] = useState(machine.getInventory());
  const [selectedFruit, setSelectedFruit] = useState<Fruit>('apple');
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState('');

  const handleBuy = () => {
    if (machine.buy(selectedFruit, amount)) {
      setMessage(`Bought ${amount} ${selectedFruit}(s).`);
      antdMessage.success(`Bought ${amount} ${selectedFruit}(s).`);
    } else {
      setMessage(`Not enough ${selectedFruit}s in inventory.`);
      antdMessage.error(`Not enough ${selectedFruit}s in inventory.`);
    }
    setInventory(machine.getInventory());
  };

  const handleSell = () => {
    machine.sell(selectedFruit, amount);
    setMessage(`Sold ${amount} ${selectedFruit}(s).`);
    antdMessage.info(`Sold ${amount} ${selectedFruit}(s).`);
    setInventory(machine.getInventory());
  };

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
          boxShadow: '0 2px 12px #0004',
          minWidth: 350,
          maxWidth: 400,
        }}
        bodyStyle={{ padding: 32 }}
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
              onChange={(value) => {
                setSelectedFruit(value as Fruit);
              }}
              style={{ width: 120 }}
              getPopupContainer={() => document.body}
              dropdownMatchSelectWidth={false}
              dropdownClassName='fruit-select-dropdown'
            >
              {fruitList.map((fruit) => (
                <Select.Option key={fruit} value={fruit}>
                  {fruit}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='Amount'>
            <InputNumber
              min={1}
              value={amount}
              onChange={(value) => setAmount(Number(value))}
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
            <Text
              strong
              style={{
                color: message.startsWith('Bought')
                  ? '#52c41a'
                  : message.startsWith('Not enough')
                  ? '#f5222d'
                  : undefined,
              }}
            >
              {message}
            </Text>
          )}
        </div>
        <Title level={4} style={{ marginBottom: 8 }}>
          Inventory
        </Title>
        <List
          size='small'
          dataSource={fruitList}
          renderItem={(fruit) => (
            <List.Item style={{ padding: '4px 0' }}>
              <Text style={{ color: '#bfcfff', fontSize: 16 }}>
                {fruit}:
                <Text strong style={{ color: '#222' }}>
                  {inventory[fruit]}
                </Text>
              </Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
