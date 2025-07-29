describe('Utility Functions', () => {
  test('should generate unique ID', async () => {
    const generateId = () => Date.now().toString();
    
    const id1 = generateId();
    await new Promise(resolve => setTimeout(resolve, 1));
    const id2 = generateId();
    
    expect(id1).toBeDefined();
    expect(typeof id1).toBe('string');
    expect(id1).not.toBe(id2);
  });

  test('should calculate attendance percentage', () => {
    const calculateAttendanceRate = (present, total) => {
      return total > 0 ? Math.round((present / total) * 100) : 0;
    };
    
    expect(calculateAttendanceRate(8, 10)).toBe(80);
    expect(calculateAttendanceRate(0, 0)).toBe(0);
    expect(calculateAttendanceRate(5, 5)).toBe(100);
  });
});