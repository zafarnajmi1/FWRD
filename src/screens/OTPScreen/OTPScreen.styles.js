const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgcolor,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },

  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: hp(8),
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: colors.subheading,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },

  phoneText: {
    fontWeight: "600",
    color: colors.black,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 24,
  },

  otpBox: {
    width: 48,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },

  resendText: {
    fontSize: 14,
    color: colors.subheading,
  },

  resendBtn: {
    color: colors.primary,
    fontWeight: "600",
  },

  bottom: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
