import { adminApi, ensurePractisableTopic, post, publishNewQuestion, registerLearner } from "./api";
import { register } from "./helpers";
import { expect, test } from "./test";

/**
 * What a screen reader is given. These assert the accessibility tree: the roles, the accessible
 * names and the nesting, which is what a screen reader announces and lets a reader navigate by.
 * A real screen reader still has to be heard by a person, but a change that quietly turns a group
 * into an unnamed box, or a heading into bold text, fails here instead of in someone's ears.
 *
 * The question used is published by this spec with fixed text, so the tree does not depend on which
 * of the shared fixtures a session happens to draw.
 */
const TOPIC_ID = "a3000000-0000-4000-8000-000000000002"; // Controlling program flow
const PROMPT = "Which statement about this program is true?";

test.describe("what a screen reader is given", () => {
  test.skip(({ isMobile }) => isMobile, "the tree is the same; this keeps the run short");

  test("the sign-in page announces a landmark, a heading and labelled fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();

    await expect(page.locator("body")).toMatchAriaSnapshot(`
      - link "Skip to main content"
      - banner:
        - text: CertForge
        - combobox "Language":
          - option "English" [selected]
          - option "Português (Brasil)"
      - main:
        - heading "Sign in" [level=1]
        - text: Email
        - textbox "Email"
        - text: Password
        - textbox "Password"
        - button "Sign in"
        - paragraph:
          - text: New here?
          - link "Create an account"
    `);
  });

  test("a question is a named region with named groups of choices", async ({ page, request }) => {
    const admin = await adminApi();
    await ensurePractisableTopic(admin, TOPIC_ID, PROMPT);
    await admin.dispose();

    await register(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Java Certification" }).click();
    await page.getByRole("button", { name: "Practice Controlling program flow" }).click();
    await expect(page.getByRole("heading", { level: 2, name: /^Question 1 of/ })).toBeVisible();

    await expect(page.getByRole("region", { name: /^Question 1 of/ })).toMatchAriaSnapshot(`
      - region /Question 1 of \\d+/:
        - heading /Question 1 of \\d+/ [level=2]
        - paragraph: /Which statement about this program is true\\?/
        - group "Choose one answer":
          - text: Choose one answer
          - 'radio "Option A: The expected option"'
          - text: "Option A: The expected option"
          - 'radio "Option B: A wrong option"'
          - text: "Option B: A wrong option"
        - group "How confident are you?":
          - text: How confident are you?
          - radio "Low – I am guessing"
          - text: Low – I am guessing
          - radio "Medium – I am fairly sure"
          - text: Medium – I am fairly sure
          - radio "High – I am certain"
          - text: High – I am certain
        - button "Submit answer"
    `);
    expect(request).toBeDefined();
  });

  test("the result of an answer is a named region that says correctness in words", async ({ page }) => {
    const admin = await adminApi();
    await ensurePractisableTopic(admin, TOPIC_ID, PROMPT);
    await admin.dispose();

    await register(page);
    await page.goto("/");
    await page.getByRole("link", { name: "Java Certification" }).click();
    await page.getByRole("button", { name: "Practice Controlling program flow" }).click();
    await page.locator("#option-A").check();
    await page.getByLabel(/Medium/).check();
    await page.getByRole("button", { name: "Submit answer" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Correct" })).toBeVisible();

    await expect(page.getByRole("region", { name: "Correct" })).toMatchAriaSnapshot(`
      - region "Correct":
        - heading "Correct" [level=2]
        - paragraph: /Which statement about this program is true\\?/
        - list:
          - listitem:
            - paragraph:
              - strong: A. The expected option
            - paragraph: Your answer. Correct answer.
            - paragraph: Expected by the test.
          - listitem:
            - paragraph:
              - strong: B. A wrong option
            - paragraph: Incorrect answer.
            - paragraph: Wrong on purpose.
        - heading "Explanation" [level=3]
        - paragraph: "Test data: the first option is expected."
        - heading "Read more" [level=3]
        - list:
          - listitem:
            - link "Java SE 21 documentation (opens in a new tab)":
              - /url: https://docs.oracle.com/en/java/javase/21/
        - paragraph:
          - button "Next question"
    `);
  });

  test("the error summary is announced as an alert and links to the field it is about", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("alert")).toMatchAriaSnapshot(`
      - alert:
        - heading "There is a problem" [level=2]
        - list:
          - listitem:
            - link "Enter your email address."
          - listitem:
            - link "Enter your password."
    `);
  });

  test("a session a learner cannot see is not described to them either", async ({ request }) => {
    const admin = await adminApi();
    await publishNewQuestion(admin, TOPIC_ID, PROMPT);
    await admin.dispose();

    await registerLearner(request);
    const started = await (await post(request, "/api/study/sessions", { topicId: TOPIC_ID, questionCount: 1 })).json();
    const stranger = await registerLearner(request);
    expect(stranger.email).toContain("@");

    expect((await request.get(`/api/study/sessions/${started.id}`)).status()).toBe(404);
  });
});
