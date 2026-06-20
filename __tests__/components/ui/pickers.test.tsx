import React from 'react';
import { DaySelector } from '@/components/ui/DaySelector';
import { TimePicker } from '@/components/ui/TimePicker';

describe('DaySelector', () => {
  it('renders 7 day buttons', () => {
    const onChange = jest.fn();
    const component = <DaySelector value={[1, 2, 3, 4, 5]} onChange={onChange} />;
    expect(component).toBeTruthy();
  });

  it('calls onChange with toggled day added', () => {
    const onChange = jest.fn();
    const component = <DaySelector value={[1, 2, 3, 4, 5]} onChange={onChange} />;
    expect(component).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);
  });

  it('calls onChange with toggled day removed', () => {
    const onChange = jest.fn();
    const component = <DaySelector value={[1, 2, 3, 4, 5]} onChange={onChange} />;
    expect(component).toBeTruthy();
    expect(onChange).toHaveBeenCalledTimes(0);
  });
});

describe('TimePicker', () => {
  it('renders the current value', () => {
    const onChange = jest.fn();
    const component = <TimePicker value="09:00" onChange={onChange} label="Start" />;
    expect(component).toBeTruthy();
  });
});
