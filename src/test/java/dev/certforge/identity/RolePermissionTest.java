package dev.certforge.identity;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RolePermissionTest {

  @Test
  void learnerCanOnlyStudy() {
    assertThat(Role.LEARNER.permissions()).containsExactly(Permission.STUDY);
  }

  @Test
  void editorAndReviewerHoldOnlyTheirOwnContentPermission() {
    assertThat(Role.EDITOR.permissions()).containsExactly(Permission.CONTENT_AUTHOR);
    assertThat(Role.REVIEWER.permissions()).containsExactly(Permission.CONTENT_REVIEW);
  }

  @Test
  void onlyAdministratorCanPublishManageCatalogAndManageAccounts() {
    assertThat(Role.ADMINISTRATOR.permissions())
        .contains(Permission.CONTENT_PUBLISH, Permission.CATALOG_MANAGE, Permission.ACCOUNT_MANAGE);
    for (Role role : Role.values()) {
      if (role != Role.ADMINISTRATOR) {
        assertThat(role.permissions())
            .doesNotContain(
                Permission.CONTENT_PUBLISH, Permission.CATALOG_MANAGE, Permission.ACCOUNT_MANAGE);
      }
    }
  }

  @Test
  void onlyTheAdministratorMayReviewTheirOwnWork() {
    // The rule a one-maintainer project needs, kept narrow: the account whose judgement is final
    // answers for its own revisions, and an author added later still cannot approve their own.
    assertThat(Role.ADMINISTRATOR.permissions()).contains(Permission.CONTENT_SELF_REVIEW);
    assertThat(Role.EDITOR.permissions()).doesNotContain(Permission.CONTENT_SELF_REVIEW);
    assertThat(Role.REVIEWER.permissions()).doesNotContain(Permission.CONTENT_SELF_REVIEW);
    assertThat(Role.LEARNER.permissions()).doesNotContain(Permission.CONTENT_SELF_REVIEW);
  }

  @Test
  void returnedPermissionSetIsACopy() {
    Role.LEARNER.permissions().clear();

    assertThat(Role.LEARNER.permissions()).containsExactly(Permission.STUDY);
  }
}
