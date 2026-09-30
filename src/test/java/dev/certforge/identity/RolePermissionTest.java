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
  void returnedPermissionSetIsACopy() {
    Role.LEARNER.permissions().clear();

    assertThat(Role.LEARNER.permissions()).containsExactly(Permission.STUDY);
  }
}
