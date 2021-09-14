from app.models import Department, Organisation

# If the validated_data contains a department id or a null department, update it
def update_department_id(instance, validated_data):
    department_id = validated_data.get("department")
    if department_id != None:
        department = Department.objects.get(id = department_id)
        instance.department = department
    elif "department" in validated_data:
        instance.department = None

def update_organisation_id(instance, validated_data):
    organisation_id = validated_data.get("organisation")
    if organisation_id != None:
        organisation = Organisation.objects.get(id = organisation_id)
        instance.organisation = organisation
    elif "organisation" in validated_data:
        instance.organisation = None
