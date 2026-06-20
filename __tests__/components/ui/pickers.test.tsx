import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DaySelector } from '@/components/ui/DaySelector';
import { TimePicker } from '@/components/ui/TimePicker';

describe('DaySelector', () => {
  it('renders 7 day buttons', async () => {
    const { getAllByRole } = await render(
      <DaySelector value={[1, 2, 3, 4, 5]} onChange={jest.fn()} />
    );
    expect(getAllByRole('button')).toHaveLength(7);
  });

  it('calls onChange with toggled day added', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <DaySelector value={[1, 2, 3, 4, 5]} onChange={onChange} />
    );
    fireEvent.press(getByText('Sa'));
    expect(onChange).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6]);
  });

  it('calls onChange with toggled day removed', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(
      <DaySelector value={[1, 2, 3, 4, 5]} onChange={onChange} />
    );
    fireEvent.press(getByText('Mo'));
    expect(onChange).toHaveBeenCalledWith([2, 3, 4, 5]);
  });
});

describe('TimePicker', () => {
  it('renders the current value', async () => {
    const { getByText } = await render(
      <TimePicker value="09:00" onChange={jest.fn()} label="Start" />
    );
    expect(getByText('Start')).toBeTruthy();
    expect(getByText('09:00')).toBeTruthy();
  });
});
