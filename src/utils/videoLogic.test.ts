import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSceneDurations,
  generateIdeasForGenre,
  buildProceduralProject,
  getCurrentSceneInfo,
  GENRES,
  VISUAL_STYLES
} from './videoLogic';

test('calculateSceneDurations sums to exact requested total', () => {
  const durations30 = calculateSceneDurations(30, 4);
  assert.equal(durations30.reduce((a, b) => a + b, 0), 30);
  assert.equal(durations30.length, 4);

  const durations45 = calculateSceneDurations(45, 5);
  assert.equal(durations45.reduce((a, b) => a + b, 0), 45);
  assert.equal(durations45.length, 5);

  const durations60 = calculateSceneDurations(60, 6);
  assert.equal(durations60.reduce((a, b) => a + b, 0), 60);
  assert.equal(durations60.length, 6);
});

test('generateIdeasForGenre returns requested count of unique items', () => {
  const ideas = generateIdeasForGenre('motivacion', 4);
  assert.equal(ideas.length, 4);
  assert.ok(ideas[0].title.length > 0);
  assert.ok(ideas[0].hook.length > 0);
  assert.equal(ideas[0].genre, 'motivacion');
});

test('buildProceduralProject generates project with valid scenes and AI prompts', () => {
  const project = buildProceduralProject('Rompe tus límites', 'motivacion', 'real', 45, '9:16');
  assert.equal(project.durationSeconds, 45);
  assert.equal(project.style, 'real');
  assert.equal(project.aspectRatio, '9:16');
  assert.ok(project.scenes.length >= 4);

  const totalSceneDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0);
  assert.equal(totalSceneDuration, 45);

  const firstScene = project.scenes[0];
  assert.ok(firstScene.promptSora.includes('Sora') || firstScene.promptSora.includes('Cinematic'));
  assert.ok(firstScene.promptKling.includes('--camera'));
  assert.ok(firstScene.promptGrok.length > 10);
  assert.ok(firstScene.promptLuma.length > 10);
});

test('buildProceduralProject supports all visual styles', () => {
  const styles = ['real', '3d', '2d', 'monigote'] as const;
  for (const style of styles) {
    const proj = buildProceduralProject('Esperanza de vida', 'esperanza', style, 30);
    assert.equal(proj.style, style);
    assert.equal(proj.scenes[0].characterStyle, style);
  }
});

test('getCurrentSceneInfo properly finds current scene along the timeline', () => {
  const project = buildProceduralProject('Test Video', 'consejos', 'monigote', 30);
  // Total is 30s. If scenes are 8s, 8s, 7s, 7s
  const infoAtStart = getCurrentSceneInfo(project.scenes, 0);
  assert.equal(infoAtStart.sceneIndex, 0);
  assert.ok(infoAtStart.sceneProgress >= 0 && infoAtStart.sceneProgress < 0.1);

  const infoMid = getCurrentSceneInfo(project.scenes, 15);
  assert.ok(infoMid.sceneIndex >= 1);
  assert.ok(infoMid.currentScene !== null);

  const infoAtEnd = getCurrentSceneInfo(project.scenes, 30);
  assert.equal(infoAtEnd.sceneIndex, project.scenes.length - 1);
});

test('all genres and styles metadata are populated', () => {
  assert.equal(GENRES.length, 6);
  assert.equal(VISUAL_STYLES.length, 4);
});
