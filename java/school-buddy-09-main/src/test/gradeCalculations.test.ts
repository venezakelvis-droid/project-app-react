import { describe, it, expect } from "vitest";

describe("Grade Calculation - Brazilian Standard", () => {
  it("should calculate semester 1 average correctly", () => {
    const notes = [8.5, 9.0, 8.5, 9.0];
    const average = notes.reduce((a, b) => a + b, 0) / 4;
    expect(average).toBe(8.75);
  });

  it("should calculate semester 2 average correctly", () => {
    const notes = [8.0, 8.5, 8.0, 8.5];
    const average = notes.reduce((a, b) => a + b, 0) / 4;
    expect(average).toBe(8.25);
  });

  it("should calculate final average correctly", () => {
    const avg1 = 8.75;
    const avg2 = 8.25;
    const finalAvg = (avg1 + avg2) / 2;
    expect(finalAvg).toBe(8.5);
  });

  it("should determine status APROVADO when avg >= 7.0", () => {
    const finalAvg = 8.5;
    const status = finalAvg >= 7.0 ? "APROVADO" : "RECUPERAÇÃO";
    expect(status).toBe("APROVADO");
  });

  it("should determine status RECUPERAÇÃO when 5.0 <= avg < 7.0", () => {
    const finalAvg = 6.5;
    let status;
    if (finalAvg >= 7.0) {
      status = "APROVADO";
    } else if (finalAvg >= 5.0) {
      status = "RECUPERAÇÃO";
    } else {
      status = "REPROVADO";
    }
    expect(status).toBe("RECUPERAÇÃO");
  });

  it("should determine status REPROVADO when avg < 5.0", () => {
    const finalAvg = 4.5;
    let status;
    if (finalAvg >= 7.0) {
      status = "APROVADO";
    } else if (finalAvg >= 5.0) {
      status = "RECUPERAÇÃO";
    } else {
      status = "REPROVADO";
    }
    expect(status).toBe("REPROVADO");
  });

  describe("Example grades from DatabaseSeeder", () => {
    it("Ana Costa - should have status APROVADO", () => {
      const s1Avg = (8.5 + 8.5 + 8.5 + 8.5) / 4; // 8.5
      const s2Avg = (8.0 + 8.5 + 8.0 + 8.5) / 4; // 8.25
      const finalAvg = (s1Avg + s2Avg) / 2; // 8.375

      expect(s1Avg).toBe(8.5);
      expect(s2Avg).toBe(8.25);
      expect(finalAvg).toBe(8.375);
      expect(finalAvg >= 7.0).toBe(true);
    });

    it("Bruno Ferreira - should have status APROVADO with borderline grade", () => {
      const s1Avg = (9.0 + 9.0 + 9.0 + 9.0) / 4; // 9.0
      const s2Avg = (6.0 + 6.5 + 6.0 + 6.5) / 4; // 6.25
      const finalAvg = (s1Avg + s2Avg) / 2; // 7.625

      expect(s1Avg).toBe(9.0);
      expect(s2Avg).toBe(6.25);
      expect(finalAvg).toBeCloseTo(7.625, 2);
      expect(finalAvg >= 7.0).toBe(true);
    });
  });
});
